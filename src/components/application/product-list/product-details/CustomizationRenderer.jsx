import React, { useEffect, useState } from "react";
import useStyles from "./style";
import { Grid, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

const CustomizationRenderer = (props) => {
  const { productPayload, customization_state, setCustomizationState } = props;

  const classes = useStyles();

  const [isInitialized, setIsInitialized] = useState(false);
  const [customizationGroups, setCustomizationGroups] = useState([]);
  const [customizations, setCustomizations] = useState([]);
  const [highestSeq, setHighestSeq] = useState(0);

  const handleCustomizationSelect = (selectedOption, level) => {
    const newState = { ...customization_state };

    // Check if the parent's customization group has minQuantity === 0
    const parentGroup = customizationGroups.find((group) => group.id === selectedOption.parent);
    const parentAllowsUnselecting = parentGroup && parentGroup.minQuantity === 0;

    if (parentGroup.seq === highestSeq) {
      if (
        newState[level].selected.length < parentGroup.maxQuantity &&
        !newState[level].selected.includes(selectedOption)
      ) {
        newState[level].id = parentGroup.id;
        newState[level].seq = parentGroup.seq;
        newState[level].selected = [...newState[level].selected, selectedOption];
      } else {
        newState[level].selected = newState[level].selected.filter((item) => item.id !== selectedOption.id);
        setCustomizationState(newState);
        return;
      }
    }

    // If the option is already selected and unselecting is allowed, deselect it
    else if (
      (parentAllowsUnselecting && newState[level].selected.includes(selectedOption)) ||
      !newState[level].selected.includes(selectedOption)
    ) {
      if (newState[level].selected.includes(selectedOption)) {
        newState[level].selected = [];
        for (let i = level + 1; i <= Object.keys(newState).length; i++) {
          delete newState[i];
        }
        setCustomizationState(newState);
        return;
      } else {
        newState[level].id = parentGroup.id;
        newState[level].seq = parentGroup.seq;
        newState[level].selected = [selectedOption];
      }
    }

    // Reset subsequent groups' selections
    for (let i = level + 1; i <= Object.keys(newState).length; i++) {
      delete newState[i];
    }

    let currentSelectedOption = selectedOption; // Store the current selectedOption
    while (currentSelectedOption.child) {
      const nextGroup = customizationGroups.find((group) => group.id === currentSelectedOption.child);
      if (nextGroup) {
        // Render options for non-mandatory group, but don't select any option
        if (nextGroup.minQuantity === 0) {
          newState[level + 1] = {
            id: nextGroup.id,
            seq: nextGroup.seq,
            name: nextGroup.name,
            options: customizations.filter((c) => c.parent === nextGroup.id),
            selected: [],
          };

          for (let i = level + 2; i <= Object.keys(newState).length; i++) {
            delete newState[i];
          }

          setCustomizationState(newState); // Set state after rendering options
          return; // Exit loop after rendering options
        }

        const nextGroupOptions = customizations.filter((customization) => customization.parent === nextGroup.id);
        const nextSelectedOption = nextGroupOptions.find((opt) => opt.isDefault && opt.inStock) || nextGroupOptions[0];

        if (nextSelectedOption) {
          level++;
          newState[level] = {
            id: nextGroup.id,
            name: nextGroup.name,
            options: nextGroupOptions,
            selected: [nextSelectedOption],
          };

          // Reset selections for subsequent groups under the new selection
          for (let i = level + 1; i <= Object.keys(newState).length; i++) {
            delete newState[i];
          }

          currentSelectedOption = nextSelectedOption; // Update the current selectedOption
        } else {
          break;
        }
      } else {
        break;
      }
    }

    setCustomizationState(newState);
  };

  const formatCustomizationGroups = (customisation_groups) => {
    const formattedCustomizationGroups = customisation_groups?.map((group) => {
      const configTags = group.tags.find((tag) => tag.code === "config").list;
      const minConfig = configTags.find((tag) => tag.code === "min").value;
      const maxConfig = configTags.find((tag) => tag.code === "max").value;
      const inputTypeConfig = configTags.find((tag) => tag.code === "input").value;
      const seqConfig = configTags.find((tag) => tag.code === "seq").value;

      return {
        id: group.local_id,
        name: group.descriptor.name,
        inputType: inputTypeConfig,
        minQuantity: parseInt(minConfig),
        maxQuantity: parseInt(maxConfig),
        seq: parseInt(seqConfig),
      };
    });

    return formattedCustomizationGroups;
  };

  const formatCustomizations = (customisation_items) => {
    const customizations = customisation_items.map((customization) => {
      const itemDetails = customization.item_details;
      const parentTag = itemDetails.tags.find((tag) => tag.code === "parent");
      const childTag = itemDetails.tags.find((tag) => tag.code === "child");

      return {
        id: itemDetails.id,
        name: itemDetails.descriptor.name,
        price: itemDetails.price.value,
        inStock: itemDetails.quantity.available.count > 0,
        parent: parentTag ? parentTag.list.find((tag) => tag.code === "id").value : null,
        child: childTag ? childTag.list.find((tag) => tag.code === "id").value : null,
      };
    });
    return customizations;
  };

  useEffect(() => {
    if (productPayload) {
      const { customisation_groups, customisation_items } = productPayload;
      setCustomizationGroups(formatCustomizationGroups(customisation_groups));
      setCustomizations(formatCustomizations(customisation_items));
    }
  }, [productPayload]);

  // initialize customization state
  useEffect(() => {
    if (!isInitialized && customizationGroups.length > 0 && customizations.length > 0) {
      const initializeCustomizationState = () => {
        let firstGroup = null;
        for (const group of customizationGroups) {
          if (group.seq === 1) {
            firstGroup = group;
            break;
          }
        }
        if (firstGroup) {
          let currentGroup = firstGroup.id;
          let level = 1;
          const newState = { ...customization_state };

          while (currentGroup) {
            const group = customizationGroups.find((group) => group.id === currentGroup);
            if (group) {
              newState[level] = {
                id: group.id,
                seq: group.seq,
                name: group.name,
                options: [],
                selected: [],
              };
              newState[level].options = customizations.filter((customization) => customization.parent === currentGroup);

              // Skip selecting an option for non-mandatory groups (minQuantity === 0)
              if (group.minQuantity === 1) {
                const selectedCustomization = newState[level].options.find((opt) => opt.isDefault && opt.inStock);

                // If no default option, select the first available option
                if (!selectedCustomization) {
                  newState[level].selected = [newState[level].options.find((opt) => opt.inStock)];
                } else {
                  newState[level].selected = [selectedCustomization];
                }
              }

              currentGroup = newState[level].selected[0]?.child || null;
              level++;

              // If a non-mandatory group is encountered, break the loop
              if (group.minQuantity === 0) {
                break;
              }
            } else {
              currentGroup = null;
            }
          }

          setCustomizationState(newState);
        }
      };

      setHighestSeq(Math.max(...customizationGroups.map((group) => group.seq)));
      initializeCustomizationState();
      setIsInitialized(true);
    }
  }, [customizationGroups, customizations, isInitialized]);

  const renderCustomizations = () => {
    return Object.keys(customization_state).map((level) => {
      const cg = customization_state[level];

      return (
        <>
          <>
            <Typography variant="body" color="black" sx={{ margin: "12px 0" }}>
              {cg.name}
            </Typography>
            <Grid container>
              {cg.options.map((c) => (
                <>
                  <div
                    className={cg.selected.includes(c) ? classes.selectedCustomization : classes.customization}
                    onClick={() => handleCustomizationSelect(c, parseInt(level))}
                  >
                    {cg.seq == highestSeq && cg.selected.includes(c) && (
                      <CloseIcon fontSize="small" className={classes.cross} />
                    )}
                    <Typography variant="body1" color={cg.selected.includes(c) ? "white" : "#686868"}>
                      {c.name}
                    </Typography>
                    <Typography
                      variant="body1"
                      color={cg.selected.includes(c) ? "white" : "#222"}
                      sx={{ fontSize: 16, fontWeight: 600 }}
                    >
                      <CurrencyRupeeIcon sx={{ fontSize: 16, marginBottom: "2px" }} />
                      {c.price}
                    </Typography>
                  </div>
                </>
              ))}
            </Grid>
          </>
        </>
      );
    });
  };

  return <>{renderCustomizations()}</>;
};

export default CustomizationRenderer;
