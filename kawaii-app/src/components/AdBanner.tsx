import React from 'react';

interface AdBannerProps {
  adUnitId?: string;
  className?: string;
}

/**
 * AdMob Banner para app Android (Play Store).
 * App ID:     ca-app-pub-1847479853575468~8622537801
 * Ad Unit ID: ca-app-pub-1847479853575468/3656786624
 */

const ADMOB_AD_UNIT_ID = 'ca-app-pub-1847479853575468/3656786624';

export default function AdBanner({ adUnitId = ADMOB_AD_UNIT_ID, className = '' }: AdBannerProps) {
  return (
    <div
      className={`w-full flex justify-center items-center bg-gray-50/50 rounded-2xl border border-pastel-pink/20 min-h-[60px] ${className}`}
      data-admob-unit-id={adUnitId}
      id="admob-banner"
    >
      <span className="text-xs text-gray-400 opacity-50">Advertisement</span>
    </div>
  );
}
