import React, { useMemo } from "react";
import { Controller, useWatch } from "react-hook-form";

export default function RegionServiceSelect({
  labelPrefix,
  hubs,
  control,
  setValue,
  regionName,
  centerName,
  errors,
}) {
  // ✅ active hubs only
  const activeHubs = useMemo(
    () => hubs.filter((h) => String(h.status).toLowerCase() === "active"),
    [hubs],
  );

  // ✅ unique regions
  const regions = useMemo(() => {
    const set = new Set(activeHubs.map((h) => h.region).filter(Boolean));
    return Array.from(set).sort();
  }, [activeHubs]);

  // ✅ reactive selected region (THIS IS THE KEY FIX)
  const selectedRegion = useWatch({ control, name: regionName });

  // ✅ centers (district) for selected region
  const centers = useMemo(() => {
    if (!selectedRegion) return [];
    const set = new Set(
      activeHubs
        .filter((h) => h.region === selectedRegion)
        .map((h) => h.district)
        .filter(Boolean),
    );
    return Array.from(set).sort();
  }, [activeHubs, selectedRegion]);

  const isValidRegion = (val) => activeHubs.some((h) => h.region === val);

  // ✅ unique datalist id (avoid duplicate id bug)
  const regionListId = `${labelPrefix}-${regionName}-regionList`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Region searchable */}
      <div>
        <label className="text-sm font-medium text-slate-700">
          {labelPrefix} Region <span className="text-red-500">*</span>
        </label>

        <Controller
          control={control}
          name={regionName}
          rules={{
            required: `${labelPrefix} region required`,
            validate: (val) => isValidRegion(val) || "Select a valid region",
          }}
          render={({ field }) => (
            <>
              <input
                {...field}
                list={regionListId}
                placeholder="Type to search region (e.g. Dhaka)"
                className="mt-1 w-full rounded-lg border px-3 py-2"
                onChange={(e) => {
                  field.onChange(e.target.value);
                  setValue(centerName, ""); // reset center when region changes
                }}
              />
              <datalist id={regionListId}>
                {regions.map((r) => (
                  <option key={r} value={r} />
                ))}
              </datalist>
            </>
          )}
        />

        {errors?.[regionName] && (
          <p className="text-xs text-red-600 mt-1">
            {errors[regionName].message}
          </p>
        )}
      </div>

      {/* Service Center */}
      <div>
        <label className="text-sm font-medium text-slate-700">
          {labelPrefix} Service Center <span className="text-red-500">*</span>
        </label>

        <Controller
          control={control}
          name={centerName}
          rules={{ required: `${labelPrefix} service center required` }}
          render={({ field }) => (
            <select
              {...field}
              disabled={!selectedRegion}
              className="mt-1 w-full rounded-lg border px-3 py-2 disabled:bg-slate-100"
            >
              <option value="">Select service center</option>
              {centers.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}
        />

        {errors?.[centerName] && (
          <p className="text-xs text-red-600 mt-1">
            {errors[centerName].message}
          </p>
        )}
      </div>
    </div>
  );
}
