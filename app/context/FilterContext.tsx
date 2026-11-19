/* eslint-disable @typescript-eslint/no-explicit-any */
// context/FilterContext.tsx
"use client";

import React, { createContext, useContext, useReducer, useCallback, useMemo } from "react";

interface FilterContextState {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  activeFilters: string[];
}

type FilterAction =
  | { type: "SET_VALUE"; payload: { id: string; value: any } }
  | { type: "SET_ERROR"; payload: { id: string; error: string } }
  | { type: "CLEAR_ERROR"; payload: { id: string } }
  | { type: "SET_TOUCHED"; payload: { id: string } }
  | { type: "RESET_FILTERS" }
  | { type: "CLEAR_FILTER"; payload: { id: string } }
  | { type: "BULK_UPDATE"; payload: { values: Record<string, any> } }; // Add this for setFilters

interface FilterContextValue extends FilterContextState {
  setValue: (id: string, value: any) => void;
  setFilters: (values: Record<string, any>) => void; // 👈 Add this line
  setError: (id: string, error: string) => void;
  clearError: (id: string) => void;
  setTouched: (id: string) => void;
  resetFilters: () => void;
  clearFilter: (id: string) => void;
  bulkUpdate: (values: Record<string, any>) => void;
  getFilterProps: (id: string) => any;
  isValid: boolean;
  dirty: boolean;
  activeCount: number;
}

const FilterContext = createContext<FilterContextValue | undefined>(undefined);

const filterReducer = (state: FilterContextState, action: FilterAction): FilterContextState => {
  switch (action.type) {
    case "SET_VALUE":
      return {
        ...state,
        values: { ...state.values, [action.payload.id]: action.payload.value },
        activeFilters: state.activeFilters.includes(action.payload.id)
          ? state.activeFilters
          : [...state.activeFilters, action.payload.id]
      };
    
    case "SET_ERROR":
      return {
        ...state,
        errors: { ...state.errors, [action.payload.id]: action.payload.error }
      };
    
    case "CLEAR_ERROR": {
      const { [action.payload.id]: _, ...remainingErrors } = state.errors;
      return {
        ...state,
        errors: remainingErrors
      };
    }
    
    case "SET_TOUCHED":
      return {
        ...state,
        touched: { ...state.touched, [action.payload.id]: true }
      };
    
    case "RESET_FILTERS":
      return {
        ...state,
        values: {},
        errors: {},
        touched: {},
        activeFilters: []
      };
    
    case "CLEAR_FILTER": {
      const { [action.payload.id]: _, ...remainingValues } = state.values;
      return {
        ...state,
        values: remainingValues,
        activeFilters: state.activeFilters.filter(id => id !== action.payload.id)
      };
    }
    
    case "BULK_UPDATE": // 👈 Handle bulk update for setFilters
      return {
        ...state,
        values: { ...state.values, ...action.payload.values },
        activeFilters: [...new Set([...state.activeFilters, ...Object.keys(action.payload.values)])]
      };
    
    default:
      return state;
  }
};

interface FilterProviderProps {
  children: React.ReactNode;
  configs: any[];
  initialValues?: Record<string, any>;
  onFilterChange?: (filters: Record<string, any>) => void;
}

export function FilterProvider({
  children,
  configs,
  initialValues = {},
  onFilterChange
}: FilterProviderProps) {
  const filtersRecord = useMemo(() => {
    return configs.reduce((acc: any, config: any) => {
      acc[config.id] = config;
      return acc;
    }, {});
  }, [configs]);

  const [state, dispatch] = useReducer(filterReducer, {
    values: initialValues,
    errors: {},
    touched: {},
    activeFilters: Object.keys(initialValues)
  });

  const validateFilter = useCallback((id: string, value: any): string | null => {
    const config = filtersRecord[id];
    if (!config?.validation) return null;

    const { required, min, max, minLength, maxLength, pattern, custom } = config.validation;

    if (required && (value === undefined || value === null || value === '')) {
      return `${config.label} is required`;
    }

    if (typeof value === 'number') {
      if (min !== undefined && value < min) return `${config.label} must be at least ${min}`;
      if (max !== undefined && value > max) return `${config.label} must be at most ${max}`;
    }

    if (typeof value === 'string') {
      if (minLength !== undefined && value.length < minLength) {
        return `${config.label} must be at least ${minLength} characters`;
      }
      if (maxLength !== undefined && value.length > maxLength) {
        return `${config.label} must be at most ${maxLength} characters`;
      }
      if (pattern && !pattern.test(value)) return `${config.label} has invalid format`;
    }

    if (custom) {
      const result = custom(value);
      if (typeof result === 'string') return result;
      if (!result) return `${config.label} is invalid`;
    }

    return null;
  }, [filtersRecord]);

  const setValue = useCallback((id: string, value: any) => {
    dispatch({ type: "SET_VALUE", payload: { id, value } });
    
    const error = validateFilter(id, value);
    if (error) {
      dispatch({ type: "SET_ERROR", payload: { id, error } });
    } else {
      dispatch({ type: "CLEAR_ERROR", payload: { id } });
    }

    if (onFilterChange) {
      const newValues = { ...state.values, [id]: value };
      onFilterChange(newValues);
    }
  }, [validateFilter, onFilterChange, state.values]);

  // 👇 Add setFilters method
  const setFilters = useCallback((values: Record<string, any>) => {
    dispatch({ type: "BULK_UPDATE", payload: { values } });
    
    // Validate all updated values
    Object.entries(values).forEach(([id, value]) => {
      const error = validateFilter(id, value);
      if (error) {
        dispatch({ type: "SET_ERROR", payload: { id, error } });
      }
    });

    if (onFilterChange) {
      onFilterChange({ ...state.values, ...values });
    }
  }, [validateFilter, onFilterChange, state.values]);

  const setError = useCallback((id: string, error: string) => {
    dispatch({ type: "SET_ERROR", payload: { id, error } });
  }, []);

  const clearError = useCallback((id: string) => {
    dispatch({ type: "CLEAR_ERROR", payload: { id } });
  }, []);

  const setTouched = useCallback((id: string) => {
    dispatch({ type: "SET_TOUCHED", payload: { id } });
  }, []);

  const resetFilters = useCallback(() => {
    dispatch({ type: "RESET_FILTERS" });
    if (onFilterChange) onFilterChange({});
  }, [onFilterChange]);

  const clearFilter = useCallback((id: string) => {
    dispatch({ type: "CLEAR_FILTER", payload: { id } });
    if (onFilterChange) {
      const { [id]: _, ...remaining } = state.values;
      onFilterChange(remaining);
    }
  }, [onFilterChange, state.values]);

  const bulkUpdate = useCallback((values: Record<string, any>) => {
    dispatch({ type: "BULK_UPDATE", payload: { values } });
    
    Object.entries(values).forEach(([id, value]) => {
      const error = validateFilter(id, value);
      if (error) dispatch({ type: "SET_ERROR", payload: { id, error } });
    });

    if (onFilterChange) onFilterChange({ ...state.values, ...values });
  }, [validateFilter, onFilterChange, state.values]);

  const getFilterProps = useCallback((id: string) => {
    const config = filtersRecord[id];
    const value = state.values[id] ?? config?.defaultValue;
    const error = state.errors[id];
    const touched = state.touched[id];

    return {
      ...config,
      value,
      error: touched ? error : undefined,
      onChange: (newValue: any) => setValue(id, newValue),
      onBlur: () => setTouched(id)
    };
  }, [filtersRecord, state.values, state.errors, state.touched, setValue, setTouched]);

  const isValid = useMemo(() => Object.keys(state.errors).length === 0, [state.errors]);
  const dirty = useMemo(() => state.activeFilters.length > 0, [state.activeFilters]);
  const activeCount = useMemo(() => state.activeFilters.length, [state.activeFilters]);

  return (
    <FilterContext.Provider value={{
      ...state,
      setValue,
      setFilters, // 👈 Add this
      setError,
      clearError,
      setTouched,
      resetFilters,
      clearFilter,
      bulkUpdate,
      getFilterProps,
      isValid,
      dirty,
      activeCount
    }}>
      {children}
    </FilterContext.Provider>
  );
}

