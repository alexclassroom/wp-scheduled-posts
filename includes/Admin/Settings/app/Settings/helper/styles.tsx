export const selectStyles = {
    control: (base, state) => ({
      ...base,
      boxShadow: "none", 
      borderColor: "#EBEEF5",
      backgroundColor: "#F9FAFC",
      color: "#6E6E8D",
      "&:hover": {
          borderColor: "#cccccc"
      },
      minWidth: 140, // Set the minimum width here
    }),
    clearIndicator: (base: any) => ({
      ...base,
      display: 'none',
      right: 0,
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
        backgroundColor: isFocused || isSelected ? '#F3F2FF' : null,
        color: "#000",
      };
    }
}