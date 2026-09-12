"use client";

import * as React from "react";

export interface BrandContextType {
  logoUrl: string | null;
  brandName: string;
  useCustomLogo: boolean;
  isLoading: boolean;
  refreshBrand: () => Promise<void>;
  updateBrand: (settings: {
    logoUrl?: string | null;
    brandName?: string;
    useCustomLogo?: boolean;
  }) => Promise<boolean>;
}

const STORAGE_KEY = "portfolio_brand_settings";

const BrandContext = React.createContext<BrandContextType>({
  logoUrl: "/logo.png",
  brandName: "Abdullah",
  useCustomLogo: true,
  isLoading: false,
  refreshBrand: async () => {},
  updateBrand: async () => false,
});

export function BrandProvider({
  children,
  initialLogoUrl = "/logo.png",
  initialBrandName = "Abdullah",
  initialUseCustomLogo = true,
}: {
  children: React.ReactNode;
  initialLogoUrl?: string | null;
  initialBrandName?: string;
  initialUseCustomLogo?: boolean;
}) {
  const [logoUrl, setLogoUrl] = React.useState<string | null>(initialLogoUrl);
  const [brandName, setBrandName] = React.useState<string>(initialBrandName);
  const [useCustomLogo, setUseCustomLogo] = React.useState<boolean>(initialUseCustomLogo);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  // Initialize from localStorage first for instantaneous client render (prevents flashing/reverting)
  React.useEffect(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.logoUrl !== undefined) setLogoUrl(parsed.logoUrl);
        if (parsed.brandName) setBrandName(parsed.brandName);
        if (parsed.useCustomLogo !== undefined) setUseCustomLogo(Boolean(parsed.useCustomLogo));
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const fetchBrand = React.useCallback(async () => {
    try {
      const res = await fetch("/api/brand");
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.settings) {
          const newLogoUrl = data.settings.logoUrl ?? "/logo.png";
          const newBrandName = data.settings.brandName || "Abdullah";
          const newUseCustomLogo = data.settings.useCustomLogo ?? true;

          setLogoUrl(newLogoUrl);
          setBrandName(newBrandName);
          setUseCustomLogo(newUseCustomLogo);

          try {
            localStorage.setItem(
              STORAGE_KEY,
              JSON.stringify({
                logoUrl: newLogoUrl,
                brandName: newBrandName,
                useCustomLogo: newUseCustomLogo,
              })
            );
          } catch {}
        }
      }
    } catch {
      // Fallback gracefully
    }
  }, []);

  React.useEffect(() => {
    fetchBrand();

    const handleBrandEvent = () => {
      fetchBrand();
    };

    window.addEventListener("brand-updated", handleBrandEvent);
    return () => {
      window.removeEventListener("brand-updated", handleBrandEvent);
    };
  }, [fetchBrand]);

  const updateBrand = async (settings: {
    logoUrl?: string | null;
    brandName?: string;
    useCustomLogo?: boolean;
  }) => {
    setIsLoading(true);

    // 1. Immediately update client state & localStorage
    const newLogo = settings.logoUrl !== undefined ? settings.logoUrl : logoUrl;
    const newName = settings.brandName || brandName;
    const newCustom =
      settings.useCustomLogo !== undefined ? settings.useCustomLogo : useCustomLogo;

    setLogoUrl(newLogo);
    setBrandName(newName);
    setUseCustomLogo(newCustom);

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          logoUrl: newLogo,
          brandName: newName,
          useCustomLogo: newCustom,
        })
      );
    } catch {}

    // 2. Persist to server API
    try {
      const res = await fetch("/api/brand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          logoUrl: newLogo,
          brandName: newName,
          useCustomLogo: newCustom,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          window.dispatchEvent(new Event("brand-updated"));
          return true;
        }
      }
      return true; // Still return true since client state & localStorage saved successfully
    } catch {
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BrandContext.Provider
      value={{
        logoUrl,
        brandName,
        useCustomLogo,
        isLoading,
        refreshBrand: fetchBrand,
        updateBrand,
      }}
    >
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  return React.useContext(BrandContext);
}
