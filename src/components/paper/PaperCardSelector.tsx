'use client';

import React from 'react';
import { PAPER_VARIANTS, type PaperVariant } from './variants';

interface PaperCardSelectorProps {
  value: PaperVariant;
  onChange: (variant: PaperVariant) => void;
  className?: string;
}

/**
 * Miniature preview rendering for each paper variant.
 * Highly detailed CSS art representing each paper's unique character.
 */
function PaperMiniature({ variant }: { variant: PaperVariant }) {
  switch (variant) {
    case 'burnt':
      return (
        <div className="relative w-full h-full rounded-sm overflow-hidden bg-gradient-to-br from-[#f2dfb6] via-[#e5c788] to-[#c99f57] border border-[#1a0802]">
          {/* Charred border & inner scorched shadow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              boxShadow:
                'inset 0 0 4px 2px #0a0401, inset 0 0 10px 4px rgba(45,16,4,0.9), inset 0 0 16px 6px rgba(110,48,12,0.6)',
            }}
          />
          {/* Glowing ember edge highlight */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              boxShadow: '0 0 3px rgba(255,110,20,0.8), inset 0 0 2px rgba(255,140,40,0.7)',
            }}
          />
          {/* Miniature burn hole on top left */}
          <div
            className="absolute top-1.5 left-2 w-3.5 h-3 rounded-full"
            style={{
              background: 'radial-gradient(circle, #0e0703 35%, #3a1505 60%, rgba(140,65,15,0.4) 80%, transparent 100%)',
              boxShadow: '0 0 2px rgba(255,90,10,0.5)',
            }}
          />
          {/* Ambient text simulation lines */}
          <div className="absolute inset-x-3 bottom-2 space-y-1 opacity-35">
            <div className="h-0.5 bg-[#3a1d08] rounded w-3/4 mx-auto" />
            <div className="h-0.5 bg-[#3a1d08] rounded w-1/2 mx-auto" />
          </div>
        </div>
      );

    case 'parchment':
      return (
        <div
          className="relative w-full h-full rounded-sm overflow-hidden border border-[#9b7235]"
          style={{
            background:
              'radial-gradient(ellipse at 40% 30%, #f7eacc 0%, #ecd49f 60%, #cba05c 100%)',
            boxShadow: 'inset 0 0 12px rgba(110,60,15,0.5), inset 0 0 2px rgba(70,35,8,0.7)',
          }}
        >
          {/* Mottled antique spots */}
          <div
            className="absolute top-2 right-2 w-5 h-4 rounded-full opacity-30"
            style={{ background: 'radial-gradient(ellipse, #8f5a20, transparent 70%)' }}
          />
          <div
            className="absolute bottom-2 left-2 w-6 h-5 rounded-full opacity-25"
            style={{ background: 'radial-gradient(ellipse, #7e4d1b, transparent 70%)' }}
          />
          {/* Warm vellum text lines */}
          <div className="absolute inset-x-3 bottom-2.5 space-y-1 opacity-30">
            <div className="h-0.5 bg-[#4a2608] rounded w-4/5 mx-auto" />
            <div className="h-0.5 bg-[#4a2608] rounded w-2/3 mx-auto" />
          </div>
        </div>
      );

    case 'torn':
      return (
        <div className="relative w-full h-full rounded-sm overflow-hidden bg-[#faf5e8] border border-[#d2c5a2] shadow-inner flex flex-col justify-between">
          {/* Jagged torn top fringe */}
          <div
            className="w-full h-2"
            style={{
              background:
                'repeating-linear-gradient(45deg, #ede2c5, #ede2c5 3px, #faf5e8 3px, #faf5e8 6px)',
              borderBottom: '1px dashed #c0b08b',
            }}
          />
          {/* Semi-transparent washi tape piece */}
          <div
            className="absolute top-0.5 left-1/2 -translate-x-1/2 w-8 h-2.5 -rotate-2 bg-[#e8dbb5]/85 border-x border-[#c9ba8e] shadow-xs"
            style={{
              clipPath: 'polygon(0 0, 100% 0, 95% 50%, 100% 100%, 0 100%, 5% 50%)',
            }}
          />
          {/* Text lines */}
          <div className="space-y-1 px-3 py-1 opacity-35">
            <div className="h-0.5 bg-[#2b2b30] rounded w-3/4 mx-auto" />
            <div className="h-0.5 bg-[#2b2b30] rounded w-1/2 mx-auto" />
          </div>
          {/* Jagged torn bottom */}
          <div
            className="w-full h-1.5"
            style={{
              background:
                'repeating-linear-gradient(-45deg, #ede2c5, #ede2c5 3px, transparent 3px, transparent 6px)',
            }}
          />
        </div>
      );

    case 'lined':
      return (
        <div className="relative w-full h-full rounded-sm overflow-hidden bg-[#fdfaf0] border border-[#d8d0be] shadow-inner">
          {/* Horizontal ruled blue lines */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'repeating-linear-gradient(to bottom, transparent, transparent 7px, rgba(90,140,200,0.4) 7px, rgba(90,140,200,0.4) 8px)',
              backgroundPosition: '0 4px',
            }}
          />
          {/* Vertical red margin line */}
          <div className="absolute top-0 bottom-0 right-3.5 w-0.5 bg-[#d65050]/60" />
          {/* Binder punch hole dots */}
          <div className="absolute right-1 top-2 w-1.5 h-1.5 rounded-full bg-[#1b130d]/30" />
          <div className="absolute right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#1b130d]/30" />
          <div className="absolute right-1 bottom-2 w-1.5 h-1.5 rounded-full bg-[#1b130d]/30" />
        </div>
      );

    case 'tazhib':
      return (
        <div className="relative w-full h-full rounded-sm overflow-hidden bg-[#fbf2dc] border-2 border-[#b8892f] p-1 shadow-inner">
          {/* Inner lapis border */}
          <div className="w-full h-full border border-[#1f3f7a] p-0.5 flex flex-col items-center justify-center relative">
            {/* Corner shamsah gold accents */}
            <div className="absolute -top-0.5 -left-0.5 w-2 h-2 bg-[#b8892f] rotate-45" />
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#b8892f] rotate-45" />
            <div className="absolute -bottom-0.5 -left-0.5 w-2 h-2 bg-[#b8892f] rotate-45" />
            <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-[#b8892f] rotate-45" />
            {/* Center crown / toranj medallion */}
            <div className="w-5 h-2 rounded-full border border-[#b8892f] bg-[#1f3f7a]/25 mb-1" />
            <div className="h-0.5 bg-[#b8892f] rounded w-2/3 opacity-70" />
          </div>
        </div>
      );

    case 'folded':
      return (
        <div className="relative w-full h-full rounded-sm overflow-hidden bg-[#f7eed9] border border-[#cfbe9a] shadow-inner">
          {/* Fold crease lines (cross) */}
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-black/15 shadow-[0_0_1px_rgba(255,255,255,0.8)]" />
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-black/15 shadow-[0_0_1px_rgba(255,255,255,0.8)]" />
          {/* Circular vintage postmark stamp */}
          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full border border-[#7a2a1a]/60 flex items-center justify-center -rotate-12">
            <div className="w-3.5 h-3.5 rounded-full border border-dotted border-[#7a2a1a]/40" />
          </div>
          {/* Subtle coffee ring */}
          <div className="absolute bottom-1.5 left-2 w-4 h-4 rounded-full border border-[#8a5d35]/30 opacity-40" />
        </div>
      );

    case 'kraft':
      return (
        <div className="relative w-full h-full rounded-sm overflow-hidden bg-[#cbb28d] border border-[#a2865d] shadow-inner p-1">
          {/* Dashed stitched border */}
          <div className="w-full h-full border border-dashed border-[#53381a]/40 rounded-xs flex flex-col justify-center items-center">
            {/* Natural cardboard fibers */}
            <div className="space-y-1 w-3/4 opacity-40">
              <div className="h-0.5 bg-[#3a2610] rounded w-full" />
              <div className="h-0.5 bg-[#3a2610] rounded w-2/3 mx-auto" />
            </div>
          </div>
        </div>
      );

    case 'lajvard':
      return (
        <div className="relative w-full h-full rounded-sm overflow-hidden bg-[#0d182b] border border-[#b8892f] shadow-inner">
          {/* Gold star flecks */}
          <div className="absolute top-1.5 left-2 w-1 h-1 rounded-full bg-[#e6c278] shadow-[0_0_3px_#e6c278]" />
          <div className="absolute top-3 right-3 w-0.5 h-0.5 rounded-full bg-[#f4e09f]" />
          <div className="absolute bottom-2.5 left-3.5 w-1 h-1 rounded-full bg-[#e6c278] shadow-[0_0_2px_#e6c278]" />
          <div className="absolute bottom-2 right-2 w-0.5 h-0.5 rounded-full bg-[#f4e09f]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#ffea9f] shadow-[0_0_4px_#e6c278]" />
          {/* Gold ink text lines */}
          <div className="absolute inset-x-3 bottom-2 space-y-1 opacity-60">
            <div className="h-0.5 bg-[#e6c278] rounded w-3/4 mx-auto" />
            <div className="h-0.5 bg-[#e6c278] rounded w-1/2 mx-auto" />
          </div>
        </div>
      );

    case 'golbarg':
      return (
        <div
          className="relative w-full h-full rounded-sm overflow-hidden border border-[#d6a5b8]"
          style={{
            background:
              'radial-gradient(circle at 60% 40%, #fff7fa 0%, #f9e2eb 55%, #edd0de 100%)',
            boxShadow: 'inset 0 0 10px rgba(180,80,120,0.18)',
          }}
        >
          {/* Watercolor blossom wash */}
          <div
            className="absolute -top-1 -right-1 w-7 h-7 rounded-full opacity-35"
            style={{
              background: 'radial-gradient(circle, #e07a9e 20%, transparent 70%)',
            }}
          />
          <div
            className="absolute -bottom-1 -left-1 w-6 h-6 rounded-full opacity-30"
            style={{
              background: 'radial-gradient(circle, #b8628b 20%, transparent 70%)',
            }}
          />
          {/* Rose tinted lines */}
          <div className="absolute inset-x-3 bottom-2.5 space-y-1 opacity-40">
            <div className="h-0.5 bg-[#8b3558] rounded w-4/5 mx-auto" />
            <div className="h-0.5 bg-[#8b3558] rounded w-3/5 mx-auto" />
          </div>
        </div>
      );

    case 'papyrus':
      return (
        <div
          className="relative w-full h-full rounded-sm overflow-hidden border border-[#a88754]"
          style={{
            background:
              'repeating-linear-gradient(0deg, #dfc698, #dfc698 2px, #d2b47e 2px, #d2b47e 4px)',
            boxShadow: 'inset 0 0 8px rgba(90,60,20,0.4)',
          }}
        >
          {/* Cross-woven vertical fibers */}
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background:
                'repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(120,80,25,0.3) 3px, rgba(120,80,25,0.3) 4px)',
            }}
          />
          {/* Text lines */}
          <div className="absolute inset-x-3 bottom-2 space-y-1 opacity-50">
            <div className="h-0.5 bg-[#3a200b] rounded w-3/4 mx-auto" />
            <div className="h-0.5 bg-[#3a200b] rounded w-1/2 mx-auto" />
          </div>
        </div>
      );

    case 'washi':
      return (
        <div className="relative w-full h-full rounded-sm overflow-hidden bg-[#faf8f2] border border-[#e2dcd0] shadow-xs">
          {/* Subtle fibrous flecks */}
          <div className="absolute inset-0 opacity-25" style={{ backgroundImage: 'radial-gradient(#8f8574 0.5px, transparent 0.5px)', backgroundSize: '6px 6px' }} />
          {/* Red vermilion square seal stamp */}
          <div className="absolute bottom-1.5 left-2 w-3.5 h-3.5 border border-[#c0392b] bg-[#c0392b]/15 rounded-xs flex items-center justify-center rotate-3">
            <span className="text-[7px] text-[#c0392b] font-bold leading-none">印</span>
          </div>
          {/* Subtle text lines */}
          <div className="absolute inset-x-3 bottom-2 space-y-1 opacity-25">
            <div className="h-0.5 bg-[#2c2c2e] rounded w-3/4 mx-auto" />
            <div className="h-0.5 bg-[#2c2c2e] rounded w-1/2 mx-auto" />
          </div>
        </div>
      );

    default:
      return <div className="w-full h-full bg-[#f2e6cf] rounded-sm" />;
  }
}

export function PaperCardSelector({ value, onChange, className = '' }: PaperCardSelectorProps) {
  return (
    <div
      role="radiogroup"
      aria-label="انتخاب طرح کاغذ"
      className={`w-full ${className}`}
      dir="rtl"
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 p-1">
        {PAPER_VARIANTS.map((v) => {
          const isSelected = v.id === value;
          return (
            <button
              key={v.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(v.id)}
              className={`group relative flex flex-col items-center rounded-xl p-2.5 text-right transition-all duration-200 cursor-pointer select-none outline-none ${
                isSelected
                  ? 'bg-[#2a1a0f]/90 border-2 border-[#e6c278] shadow-[0_0_16px_rgba(230,194,120,0.4),0_6px_14px_rgba(0,0,0,0.5)] -translate-y-1'
                  : 'bg-[#1a110a]/70 border border-[#e6c278]/25 hover:border-[#e6c278]/60 hover:bg-[#23150d] hover:-translate-y-0.5'
              }`}
            >
              {/* Selected badge */}
              {isSelected && (
                <div className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-[#e6c278] text-[#1b130d] text-[10px] font-black flex items-center justify-center shadow-md z-10 animate-in zoom-in-75 duration-150">
                  ✓
                </div>
              )}

              {/* Miniature Paper Canvas */}
              <div className="w-full h-20 rounded-md p-1 bg-black/25 flex items-center justify-center mb-2">
                <div className="w-full h-full transform transition-transform duration-200 group-hover:scale-[1.03]">
                  <PaperMiniature variant={v.id} />
                </div>
              </div>

              {/* Card Label */}
              <div className="w-full text-center">
                <span
                  className={`block text-sm font-bold truncate transition-colors ${
                    isSelected ? 'text-[#e6c278]' : 'text-[#f0e4cc] group-hover:text-white'
                  }`}
                  style={{ fontFamily: 'var(--font-naskh), serif' }}
                >
                  {v.label}
                </span>
                <span
                  className="block text-[11px] truncate opacity-65 text-[#d4c3a3] mt-0.5"
                  title={v.hint}
                >
                  {v.hint}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
