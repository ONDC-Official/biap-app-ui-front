import { createContext, useState } from "react";

export const SearchContext = createContext({
  searchData: {},
  setSearchData: () => { },
  locationData: {},
  setLocationData: () => { },
});

export function SearchContextProvider({ children }) {
    const [searchData, setSearchData] = useState();
    const [locationData, setLocationData] = useState();
    return (
        <SearchContext.Provider
            value={{
                searchData,
                setSearchData,
                locationData,
                setLocationData,
            }}
        >
            {children}
        </SearchContext.Provider>
    );
}
