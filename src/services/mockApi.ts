import type { Company } from "@/types";

type FetchOptions = {
  minDelayMs?: number;
  maxDelayMs?: number;
  shouldFailRate?: number;
  page?: number;
  pageSize?: number;
};

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function generateCompanies(page: number, pageSize: number): Company[] {
  const locations = [
    "New York, USA",
    "London, UK",
    "Tokyo, Japan",
    "Sydney, Australia",
    "Toronto, Canada",
    "Berlin, Germany",
    "Paris, France",
    "Singapore",
    "Dubai, UAE",
    "Amsterdam, Netherlands",
  ];
  const industries = [
    "Technology",
    "Finance",
    "Healthcare",
    "Media",
    "Energy",
    "Retail",
    "Manufacturing",
    "Consulting",
    "Education",
    "Transportation",
  ];

  const generated: Company[] = [];

  const startId = (page - 1) * pageSize + 1;

  for (let i = 0; i < pageSize; i++) {
    const id = startId + i;
    const location = locations[Math.floor(Math.random() * locations.length)];
    const industry = industries[Math.floor(Math.random() * industries.length)];
    const name = `${industry}${id} Corp`;
    const employees = Math.floor(Math.random() * 5000) + 50;

    generated.push({
      id,
      name,
      location,
      industry,
      employees,
    });
  }

  return generated;
}

export async function fetchCompanies(
  options: FetchOptions = {}
): Promise<Company[]> {
  const {
    minDelayMs = 350,
    maxDelayMs = 900,
    shouldFailRate = 0.05,
    page = 1,
    pageSize = 20,
  } = options;

  const delay = Math.floor(
    minDelayMs + Math.random() * (maxDelayMs - minDelayMs)
  );

  await wait(delay);

  if (Math.random() < shouldFailRate) {
    throw new Error("Mock network error: Unable to fetch companies");
  }

  const res = await fetch("/companies.json", {
    headers: { "cache-control": "no-cache" },
  });
  if (!res.ok) throw new Error("Failed to load companies");

  const baseData = (await res.json()) as Company[];

  if (page === 1) return baseData.slice(0, pageSize);

  return generateCompanies(page, pageSize);
}
