import React, { useEffect, useState } from "react";
import useStyles from "./style";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  FormControlLabel,
  Grid,
  Typography,
} from "@mui/material";
import Radio from "../../../common/Radio";

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

      const customizationObj = {
        id: group.local_id,
        name: group.descriptor.name,
        inputType: inputTypeConfig,
        minQuantity: parseInt(minConfig),
        maxQuantity: parseInt(maxConfig),
        seq: parseInt(seqConfig),
      };

      if (inputTypeConfig === "input") {
        customizationObj.special_instructions = "";
      }

      return customizationObj;
    });

    return formattedCustomizationGroups;
  };

  const formatCustomizations = (customisation_items) => {
    const customizations = customisation_items?.map((customization) => {
      const itemDetails = customization.item_details;
      const parentTag = itemDetails.tags.find((tag) => tag.code === "parent");
      const childTag = itemDetails.tags.find((tag) => tag.code === "child");
      const vegNonVegTag = itemDetails.tags.find((tag) => tag.code === "veg_nonveg");

      return {
        id: itemDetails.id,
        name: itemDetails.descriptor.name,
        price: itemDetails.price.value,
        inStock: itemDetails.quantity.available.count > 0,
        parent: parentTag ? parentTag.list.find((tag) => tag.code === "id").value : null,
        child: childTag ? childTag.list.find((tag) => tag.code === "id").value : null,
        vegNonVeg: vegNonVegTag ? vegNonVegTag.list[0].code : "",
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
    if (!isInitialized && customizationGroups?.length > 0 && customizations?.length > 0) {
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

              if (group.hasOwnProperty("special_instructions")) {
                newState[level].special_instructions = "";
              }
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

          console.log(newState);

          setCustomizationState(newState);
        }
      };

      setHighestSeq(Math.max(...customizationGroups.map((group) => group.seq)));
      initializeCustomizationState();
      setIsInitialized(true);
    }
  }, [isInitialized, customizationGroups, customizations]);

  const renderVegNonVegTag = (category = "veg") => {
    const getTagColor = () => {
      if (category === "veg") {
        return "#008001";
      } else if (category == "non_veg") {
        return "red";
      } else {
        return "red";
      }
    };

    const getTextColor = () => {
      if (category === "veg") {
        return "#419E6A";
      } else if (category == "nonVeg") {
        return "red";
      } else {
        return "red";
      }
    };

    return (
      <Grid container alignItems="center" xs={1}>
        <div className={classes.square} style={{ borderColor: getTagColor() }}>
          <div className={classes.circle} style={{ backgroundColor: getTagColor() }}></div>
        </div>
      </Grid>
    );
  };

  const renderCustomizations = () => {
    return Object.keys(customization_state).map((level) => {
      const cg = customization_state[level];

      return (
        <>
          <Accordion elevation={0} square defaultExpanded sx={{ margin: 0, minHeight: 48 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ padding: 0, margin: 0 }}>
              <Typography variant="body" color="black">
                {cg.name}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ padding: "20px 0" }}>
              <Grid sx={{ backgroundColor: "#F3F9FE", padding: "20px" }}>
                {cg.options.map((c) => (
                  <>
                    <div onClick={() => handleCustomizationSelect(c, parseInt(level))}>
                      <Grid container alignItems="center" justifyContent="space-between" sx={{ marginBottom: 1 }}>
                        <Grid container noWrap xs={8}>
                          {renderVegNonVegTag(c.vegNonVeg)}
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {c.name}
                          </Typography>
                        </Grid>
                        <Grid container xs={3} justifyContent="flex-end">
                          <Typography variant="body1" sx={{ fontWeight: 600, marginRight: 2 }}>
                            <CurrencyRupeeIcon sx={{ fontSize: 16, marginBottom: "2px" }} />
                            {c.price}
                          </Typography>
                          <Radio
                            size="small"
                            checked={cg.selected.includes(c)}
                            onClick={() => handleCustomizationSelect(c, parseInt(level))}
                            onChange={(e) => {
                              e.preventDefault();
                              handleCustomizationSelect(c, parseInt(level));
                            }}
                          />
                        </Grid>
                      </Grid>
                    </div>
                  </>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
        </>
      );
    });
  };

  return <>{renderCustomizations()}</>;
};

export default CustomizationRenderer;
