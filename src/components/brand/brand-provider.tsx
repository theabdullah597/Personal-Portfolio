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

const BrandContext = React.createContext<BrandContextType>({
  logoUrl: null,
  brandName: "Abdullah",
  useCustomLogo: false,
  isLoading: false,
  refreshBrand: async () => {},
  updateBrand: async () => false,
});

export function BrandProvider({
  children,
  initialLogoUrl = null,
  initialBrandName = "Abdullah",
  initialUseCustomLogo = false,
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

  const fetchBrand = React.useCallback(async () => {
    try {
      const res = await fetch("/api/brand");
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.settings) {
          setLogoUrl(data.settings.logoUrl ?? null);
          setBrandName(data.settings.brandName || "Abdullah");
          setUseCustomLogo(Boolean(data.settings.useCustomLogo));
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
    try {
      const res = await fetch("/api/brand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.settings) {
          setLogoUrl(data.settings.logoUrl ?? null);
          setBrandName(data.settings.brandName || "Abdullah");
          setUseCustomLogo(Boolean(data.settings.useCustomLogo));
          window.dispatchEvent(new Event("brand-updated"));
          return true;
        }
      }
      return false;
    } catch {
      return false;
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
