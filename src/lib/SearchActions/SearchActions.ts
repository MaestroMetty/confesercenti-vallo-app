import type Store from '@/types/Store';
import provincesData from '@/lib/provinces.json';

type ProvinceData = {
    nome: string;
    sigla: string;
    regione: string;
};

type ProvinceMap = Map<string, ProvinceData>;

/**
 * Creates a map of province sigla and nome to province data for quick lookup
 */
export function createProvinceMap(): ProvinceMap {
    const map = new Map<string, ProvinceData>();
    provincesData.forEach(province => {
        // Store sigla (uppercase)
        map.set(province.sigla.toUpperCase(), province);
        // Store nome (both uppercase and lowercase for case-insensitive search)
        map.set(province.nome.toUpperCase(), province);
        map.set(province.nome.toLowerCase(), province);
    });
    return map;
}

/**
 * Validates if a province code is valid
 * Returns false if the province code doesn't exist in the province map
 */
export function isValidProvince(province: string | null, provinceMap: ProvinceMap): boolean {
    if (!province) {
        return true; // No province is considered valid
    }
    const provinceUpper = province.toUpperCase().trim();
    return provinceMap.has(provinceUpper);
}

/**
 * Checks if the search term matches the store name
 */
export function matchesStoreName(store: Store, searchTerm: string): boolean {
    const searchTermLower = searchTerm.toLowerCase().trim();
    return store.name.toLowerCase().includes(searchTermLower);
}

/**
 * Checks if the search term matches the store city
 */
export function matchesCity(store: Store, searchTerm: string): boolean {
    if (!store.city) {
        return false;
    }
    const searchTermLower = searchTerm.toLowerCase().trim();
    return store.city.toLowerCase().includes(searchTermLower);
}

/**
 * Checks if the search term matches the store postal code
 */
export function matchesPostalCode(store: Store, searchTerm: string): boolean {
    if (!store.postalCode) {
        return false;
    }
    const searchTermLower = searchTerm.toLowerCase().trim();
    return store.postalCode.toLowerCase().includes(searchTermLower);
}

/**
 * Checks if the search term matches a province sigla or nome
 * Supports exact matches and partial matches for province names
 */
export function matchesProvince(
    store: Store,
    searchTerm: string,
    provinceMap: ProvinceMap
): boolean {
    if (!store.province) {
        return false;
    }

    const searchTermLower = searchTerm.toLowerCase().trim();
    const searchTermUpper = searchTerm.toUpperCase().trim();
    const storeProvinceUpper = store.province.toUpperCase().trim();

    // Check if search term matches a province sigla or nome (case-insensitive)
    const matchingProvince = provinceMap.get(searchTermUpper) || provinceMap.get(searchTermLower);
    if (matchingProvince && storeProvinceUpper === matchingProvince.sigla.toUpperCase()) {
        return true;
    }

    // Also check if search term partially matches the province nome
    for (const province of provincesData) {
        if (
            province.nome.toLowerCase().includes(searchTermLower) &&
            storeProvinceUpper === province.sigla.toUpperCase()
        ) {
            return true;
        }
    }

    return false;
}

/**
 * Checks if the store matches the selected category filter
 */
export function matchesCategory(store: Store, selectedCategory: string | null): boolean {
    return !selectedCategory || store.category === selectedCategory;
}

/**
 * Checks if the store matches the user's postal code (for location-based filtering)
 */
export function matchesUserPostalCode(store: Store, userPostalCode: string | null): boolean {
    // If no user postal code, don't filter (show all stores)
    if (!userPostalCode || userPostalCode.trim() === '') {
        return true;
    }
    
    // If store has no postal code, exclude it when filtering by location
    if (!store.postalCode || store.postalCode.trim() === '') {
        return false;
    }
    
    // Normalize postal codes:
    // 1. Remove all non-digit characters (spaces, dashes, etc.)
    // 2. Extract only digits
    // 3. Pad with leading zeros if needed (Italian CAPs are 5 digits)
    const normalizePostalCode = (code: string): string | null => {
        if (!code || typeof code !== 'string') {
            return null;
        }
        // Extract only digits
        const digits = code.replace(/\D/g, '');
        // If no digits found, return null
        if (digits.length === 0) {
            return null;
        }
        // Pad with leading zeros to ensure 5 digits for Italian CAPs
        // Take first 5 digits (in case there are more)
        return digits.padStart(5, '0').slice(0, 5);
    };
    
    const normalizedUserPostalCode = normalizePostalCode(userPostalCode);
    const normalizedStorePostalCode = normalizePostalCode(store.postalCode);
    
    // If normalization failed, don't match
    if (!normalizedUserPostalCode || !normalizedStorePostalCode) {
        return false;
    }
    
    return normalizedStorePostalCode === normalizedUserPostalCode;
}

/**
 * Filters stores based on search term, category, and location (postal code)
 * Also validates province codes and hides stores with invalid provinces
 */
export function filterStores(
    stores: Store[],
    searchTerm: string,
    selectedCategory: string | null,
    provinceMap: ProvinceMap,
    userPostalCode: string | null = null
): Store[] {
    return stores.filter(store => {
        // Validate province: if store has a province, it must match a valid sigla
        // If mapping is not successful, hide the store (assume user/data error)
        if (!isValidProvince(store.province, provinceMap)) {
            return false;
        }

        // Location-based filtering: if user postal code is provided, filter by it
        if (userPostalCode && !matchesUserPostalCode(store, userPostalCode)) {
            return false;
        }

        const searchTermLower = searchTerm.toLowerCase().trim();
        const matchesCategoryFilter = matchesCategory(store, selectedCategory);

        // If no search term, only filter by category and location
        if (!searchTermLower) {
            return matchesCategoryFilter;
        }

        // Check if search term matches store name, province, city, or postal code
        const matchesName = matchesStoreName(store, searchTerm);
        const matchesProvinceFilter = matchesProvince(store, searchTerm, provinceMap);
        const matchesCityFilter = matchesCity(store, searchTerm);
        const matchesPostalCodeFilter = matchesPostalCode(store, searchTerm);

        return (matchesName || matchesProvinceFilter || matchesCityFilter || matchesPostalCodeFilter) && matchesCategoryFilter;
    });
}

