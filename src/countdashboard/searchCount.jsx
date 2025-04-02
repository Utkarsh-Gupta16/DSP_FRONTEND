// SearchCount.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import debounce from "lodash/debounce";

const SearchCount = ({ filters, normalizeCountry, normalizeString }) => {
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [countError, setCountError] = useState(null);

  const fetchCount = useCallback(async () => {
    try {
      setLoading(true);
      setCountError(null);

      let total = 0;
      const countedSubcategories = new Set();

      const fetchCountWithRetry = async (params, retries = 3, delay = 1000) => {
        for (let i = 0; i < retries; i++) {
          try {
            const response = await axios.get("http://localhost:5000/api/companies/count", {
              params,
              timeout: 15000,
            });
            return response.data.totalCount || 0;
          } catch (err) {
            if (i === retries - 1) throw err;
            console.warn(`Retrying count fetch (${i + 1}/${retries})...`, err.message);
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        }
      };

      // Prepare location filters
      const countryValue = filters.country?.value?.trim()
        ? normalizeCountry(filters.country.value.trim())
        : null;
      const stateValue = filters.State?.value?.trim() ? filters.State.value.trim() : null;
      const cityValue = filters.City?.value?.trim() ? filters.City.value.trim() : null;

      console.log("Location Filters in SearchCount:", { countryValue, stateValue, cityValue });

      // If no subcategories or sub-subcategories are selected, return 0
      if (filters.subcategories.length === 0 && filters.subSubcategories.length === 0) {
        setTotalCount(0);
        setLoading(false);
        return;
      }

      // Process sub-subcategories first
      const batchSize = 5;
      for (let i = 0; i < filters.subSubcategories.length; i += batchSize) {
        const batch = filters.subSubcategories.slice(i, i + batchSize).map(async (subSubCatValue) => {
          const [category, subcategory, subSubcategory] = subSubCatValue.split(":");
          const params = {
            categories: category,
            subcategories: normalizeString(subcategory),
            subSubcategories: normalizeString(subSubcategory),
          };
          if (countryValue) params.Country = countryValue;
          if (stateValue) params.State = stateValue;
          if (cityValue) params.City = cityValue;
          const count = await fetchCountWithRetry(params);
          countedSubcategories.add(`${category}:${subcategory}`);
          return count;
        });
        const batchResults = await Promise.all(batch);
        total += batchResults.reduce((sum, count) => sum + count, 0);
      }

      // Process remaining subcategories that haven't been counted
      const subcategoriesToCount = filters.subcategories.filter(
        (subCatValue) => !countedSubcategories.has(subCatValue)
      );
      console.log("Subcategories to Count in SearchCount:", subcategoriesToCount);

      for (let i = 0; i < subcategoriesToCount.length; i += batchSize) {
        const batch = subcategoriesToCount.slice(i, i + batchSize).map(async (subCatValue) => {
          const [category, subcategory] = subCatValue.split(":");
          const params = {
            categories: category,
            subcategories: normalizeString(subcategory),
          };
          if (countryValue) params.Country = countryValue;
          if (stateValue) params.State = stateValue;
          if (cityValue) params.City = cityValue;
          const count = await fetchCountWithRetry(params);
          console.log(`Count for ${subCatValue}:`, count);
          return count;
        });
        const batchResults = await Promise.all(batch);
        total += batchResults.reduce((sum, count) => sum + count, 0);
      }

      console.log("Total Count in SearchCount:", total);
      setTotalCount(total);
    } catch (err) {
      console.error("Error fetching count in SearchCount:", err);
      setCountError("Failed to fetch count: " + (err.response?.data?.error || err.message));
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [filters, normalizeCountry, normalizeString]);

  const fetchCountDebounced = useMemo(() => debounce(fetchCount, 300), [fetchCount]);

  useEffect(() => {
    if (
      filters.subcategories.length > 0 ||
      filters.subSubcategories.length > 0 ||
      filters.country?.value ||
      filters.State?.value ||
      filters.City?.value
    ) {
      fetchCountDebounced();
    } else {
      setTotalCount(0);
    }
  }, [
    filters.subcategories,
    filters.subSubcategories,
    filters.country,
    filters.State,
    filters.City,
    fetchCountDebounced,
  ]);

  return (
    <div>
      {countError ? (
        <p style={{ fontSize: "14px", color: "red" }}>{countError}</p>
      ) : (
        <p style={{ fontSize: "14px", color: "#28a745", fontWeight: "bold" }}>
          {loading ? "Loading..." : totalCount.toLocaleString()} targeted companies
        </p>
      )}
    </div>
  );
};

export default SearchCount;