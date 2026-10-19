"use client";

import { Clock3, MapPin, Navigation, Phone } from "lucide-react";
import { useState } from "react";

import type { Branch } from "@/content/contact";

export function directionsUrl(query: string) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
}

function embedUrl(query: string) {
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

/**
 * Branch cards plus one map panel. The Google map is only requested after the
 * visitor asks for it (privacy, and no third-party load on first paint); no API
 * key is needed for the embed or the directions link.
 */
export function BranchLocations({ branches }: { branches: Branch[] }) {
  const [selectedId, setSelectedId] = useState(branches[0]?.id ?? null);
  const [mapRequested, setMapRequested] = useState(false);
  const selected = branches.find((branch) => branch.id === selectedId) ?? branches[0];

  if (!selected) return null;

  return (
    <div className="branch-layout">
      <ul className="branch-list">
        {branches.map((branch) => {
          const isSelected = branch.id === selected.id;
          return (
            <li className={`branch-card ${isSelected ? "is-selected" : ""}`} key={branch.id}>
              <h3>{branch.name}</h3>
              <p className="branch-line">
                <MapPin aria-hidden="true" />
                <span>
                  {branch.address.map((line) => (
                    <span className="branch-address-line" key={line}>
                      {line}
                    </span>
                  ))}
                </span>
              </p>
              {branch.phone ? (
                <p className="branch-line">
                  <Phone aria-hidden="true" />
                  <a href={telHref(branch.phone)}>{branch.phone}</a>
                </p>
              ) : null}
              {branch.hours ? (
                <p className="branch-line">
                  <Clock3 aria-hidden="true" />
                  <span>{branch.hours}</span>
                </p>
              ) : null}
              <div className="branch-actions">
                <button
                  aria-pressed={isSelected && mapRequested}
                  className="button button-secondary"
                  onClick={() => {
                    setSelectedId(branch.id);
                    setMapRequested(true);
                  }}
                  type="button"
                >
                  <MapPin aria-hidden="true" />
                  Show on map
                </button>
                <a
                  className="button button-primary"
                  href={directionsUrl(branch.mapQuery)}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Navigation aria-hidden="true" />
                  Get directions
                  <span className="sr-only"> to {branch.name} (opens Google Maps)</span>
                </a>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="branch-map">
        {mapRequested ? (
          <iframe
            allowFullScreen
            key={selected.id}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={embedUrl(selected.mapQuery)}
            title={`Map showing ${selected.name}`}
          />
        ) : (
          <div className="branch-map-facade">
            <MapPin aria-hidden="true" />
            <strong>{selected.name}</strong>
            <p>The map loads from Google Maps when you ask for it.</p>
            <button className="button button-primary" onClick={() => setMapRequested(true)} type="button">
              Load map
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
