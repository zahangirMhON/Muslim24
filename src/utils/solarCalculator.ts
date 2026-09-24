/**
 * Astronomical Solar Position Calculator
 * Calculates precise real-time Sun Azimuth, Altitude, and Sunset Azimuth
 * for any geographic coordinates and date/time.
 */

export interface SolarPosition {
  azimuth: number;            // Degrees clockwise from True North (0° = North, 90° = East, 180° = South, 270° = West)
  altitude: number;           // Degrees above horizon (-90° to +90°)
  isSunAboveHorizon: boolean; // True if sun is currently visible in the sky
  sunsetAzimuth: number;      // Degrees of sunset on the western horizon for today
  sunriseAzimuth: number;     // Degrees of sunrise on the eastern horizon for today
  qiblaOffsetFromSun: number; // Angular difference from current sun position to Kaaba
  qiblaOffsetFromSunset: number; // Angular difference from sunset to Kaaba
}

export function calculateSolarPosition(
  date: Date = new Date(),
  lat: number = 23.9013, // Kushtia default
  lng: number = 89.1204,
  qiblaBearing: number = 277.1
): SolarPosition {
  const rad = Math.PI / 180;
  const deg = 180 / Math.PI;

  const latRad = lat * rad;

  // Day of Year
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const diffTime = date.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diffTime / (24 * 3600 * 1000)) + 1;

  // Fractional year (in radians)
  const hour = date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600;
  const gamma = (2 * Math.PI / 365) * (dayOfYear - 1 + (hour - 12) / 24);

  // Equation of time in minutes
  const eqtime =
    229.18 *
    (0.000075 +
      0.001868 * Math.cos(gamma) -
      0.032077 * Math.sin(gamma) -
      0.014615 * Math.cos(2 * gamma) -
      0.040849 * Math.sin(2 * gamma));

  // Solar declination in radians
  const decl =
    0.006918 -
    0.399912 * Math.cos(gamma) +
    0.070257 * Math.sin(gamma) -
    0.006758 * Math.cos(2 * gamma) +
    0.000907 * Math.sin(2 * gamma) -
    0.002697 * Math.cos(3 * gamma) +
    0.00148 * Math.sin(3 * gamma);

  // Timezone offset in minutes (Bangladesh is UTC+6 = -360 mins from getTimezoneOffset())
  const tzOffsetMinutes = -date.getTimezoneOffset();

  // True solar time in minutes
  const timeOffset = eqtime + 4 * lng - tzOffsetMinutes;
  const tst = hour * 60 + timeOffset;

  // Solar Hour Angle in degrees (-180 to +180)
  let ha = tst / 4 - 180;
  if (ha < -180) ha += 360;
  if (ha > 180) ha -= 360;
  const haRad = ha * rad;

  // Solar zenith angle
  const cosZenith =
    Math.sin(latRad) * Math.sin(decl) +
    Math.cos(latRad) * Math.cos(decl) * Math.cos(haRad);
  const zenithRad = Math.acos(Math.max(-1, Math.min(1, cosZenith)));
  const altitude = 90 - zenithRad * deg;

  // Solar Azimuth (degrees from North clockwise)
  const y = -Math.sin(haRad);
  const x = Math.tan(decl) * Math.cos(latRad) - Math.sin(latRad) * Math.cos(haRad);
  let azimuth = Math.atan2(y, x) * deg;
  azimuth = (azimuth + 360) % 360;

  // Sunrise and Sunset Azimuth approximation (atmospheric refraction angle -0.833°)
  const h0 = -0.833 * rad;
  const cosHaSunset =
    (Math.sin(h0) - Math.sin(latRad) * Math.sin(decl)) /
    (Math.cos(latRad) * Math.cos(decl));

  let sunsetAzimuth = 270;
  let sunriseAzimuth = 90;

  if (cosHaSunset >= -1 && cosHaSunset <= 1) {
    const haSunset = Math.acos(cosHaSunset) * deg;
    // Sunset Azimuth
    const ySet = -Math.sin(haSunset * rad);
    const xSet = Math.tan(decl) * Math.cos(latRad) - Math.sin(latRad) * Math.cos(haSunset * rad);
    sunsetAzimuth = (Math.atan2(ySet, xSet) * deg + 360) % 360;

    // Sunrise Azimuth is symmetric around North-South
    sunriseAzimuth = (360 - sunsetAzimuth + 360) % 360;
  }

  // Angular difference from Sun / Sunset to Kaaba
  const qiblaOffsetFromSun = Number(((qiblaBearing - azimuth + 540) % 360 - 180).toFixed(1));
  const qiblaOffsetFromSunset = Number(((qiblaBearing - sunsetAzimuth + 540) % 360 - 180).toFixed(1));

  return {
    azimuth: Number(azimuth.toFixed(1)),
    altitude: Number(altitude.toFixed(1)),
    isSunAboveHorizon: altitude > 0,
    sunsetAzimuth: Number(sunsetAzimuth.toFixed(1)),
    sunriseAzimuth: Number(sunriseAzimuth.toFixed(1)),
    qiblaOffsetFromSun,
    qiblaOffsetFromSunset
  };
}
