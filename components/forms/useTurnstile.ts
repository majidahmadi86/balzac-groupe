"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Cloudflare Turnstile, rendered explicitly and only once someone starts using a form: pages stay
// static and a reader never loads the vendor script or asks the server for the captcha settings.
// appearance "interaction-only" keeps the widget invisible unless Cloudflare asks for an interaction;
// then it shows in the form's captcha slot.

export type CaptchaConfig = { siteKey: string; scriptUrl: string } | null;
/** "pending" until the settings have been asked for, then "on" or "off" (keys not set on the server). */
export type CaptchaStatus = "pending" | "on" | "off";

type TurnstileApi = {
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let loader: Promise<TurnstileApi> | null = null;

function loadTurnstile(src: string): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (!loader) {
    loader = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error("Turnstile did not initialise")));
      script.onerror = () => {
        loader = null;
        script.remove();
        reject(new Error("Turnstile script failed to load"));
      };
      document.head.appendChild(script);
    });
  }
  return loader;
}

type Options = {
  action: string;
  language: string;
  /** Changes whenever the form remounts, so a fresh widget (and single-use token) goes with it. */
  resetKey: number;
  /** Render straight away instead of waiting for the first interaction. */
  eager: boolean;
};

export function useTurnstile(loadConfig: () => Promise<CaptchaConfig>, { action, language, resetKey, eager }: Options) {
  const slotRef = useRef<HTMLDivElement>(null);
  const tokenRef = useRef<string | null>(null);
  const interactiveRef = useRef(false);
  const configRef = useRef<Promise<CaptchaConfig> | null>(null);
  const waiters = useRef<Array<(token: string | null) => void>>([]);
  const [config, setConfig] = useState<CaptchaConfig | undefined>(undefined);
  const [started, setStarted] = useState(eager);
  const [interactive, setInteractive] = useState(false);

  const settle = useCallback((token: string | null) => {
    tokenRef.current = token;
    for (const resolve of waiters.current.splice(0)) resolve(token);
  }, []);

  /** Asks the server once whether captcha is configured. A failed request counts as off; the server still decides. */
  const resolveConfig = useCallback(() => {
    if (!configRef.current) {
      configRef.current = loadConfig()
        .catch(() => null)
        .then((value) => {
          setConfig(value);
          return value;
        });
    }
    return configRef.current;
  }, [loadConfig]);

  const start = useCallback(() => {
    setStarted(true);
    void resolveConfig();
  }, [resolveConfig]);

  useEffect(() => {
    if (eager) start();
  }, [eager, start]);

  useEffect(() => {
    if (!config || !started) return;
    let cancelled = false;
    let widgetId: string | null = null;
    tokenRef.current = null;

    loadTurnstile(config.scriptUrl)
      .then((api) => {
        const slot = slotRef.current;
        if (cancelled || !slot) return;
        widgetId = api.render(slot, {
          sitekey: config.siteKey,
          action,
          language,
          theme: "light",
          appearance: "interaction-only",
          // The flexible widget needs 300px; narrow form panels get the compact one.
          size: slot.clientWidth < 300 ? "compact" : "flexible",
          "response-field": false,
          callback: (token: string) => settle(token),
          "expired-callback": () => {
            tokenRef.current = null;
          },
          "error-callback": () => {
            tokenRef.current = null;
          },
          "before-interactive-callback": () => {
            interactiveRef.current = true;
            setInteractive(true);
          },
          "after-interactive-callback": () => {
            interactiveRef.current = false;
            setInteractive(false);
          },
        });
      })
      .catch((error) => {
        console.warn("[forms] captcha unavailable:", error.message);
        settle(null);
      });

    return () => {
      cancelled = true;
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
      tokenRef.current = null;
      interactiveRef.current = false;
      setInteractive(false);
    };
  }, [config, started, action, language, resetKey, settle]);

  /**
   * Resolves with a token; with null when captcha is off, or when none arrives in time (the server
   * then answers with the failure state).
   */
  const getToken = useCallback(
    async (timeoutMs = 20000): Promise<string | null> => {
      start();
      const settings = await resolveConfig();
      if (!settings) return null;
      if (tokenRef.current) return tokenRef.current;
      return new Promise((resolve) => {
        const done = (token: string | null) => {
          clearTimeout(timer);
          resolve(token);
        };
        const expire = () => {
          // Never cut someone off while they are answering a challenge.
          if (interactiveRef.current) {
            timer = setTimeout(expire, 5000);
            return;
          }
          waiters.current = waiters.current.filter((fn) => fn !== done);
          resolve(null);
        };
        let timer = setTimeout(expire, timeoutMs);
        waiters.current.push(done);
      });
    },
    [resolveConfig, start],
  );

  const status: CaptchaStatus = config === undefined ? "pending" : config ? "on" : "off";
  return { status, slotRef, start, getToken, interactive };
}
