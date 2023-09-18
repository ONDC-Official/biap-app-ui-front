import React, { useEffect, useState } from "react";
import useStyles from "./style";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { Accordion, AccordionDetails, AccordionSummary, FormControlLabel, Grid, Typography } from "@mui/material";
import Radio from "../../../common/Radio";
import Checkbox from "../../../common/Checkbox";
import { createCustomizationAndGroupMapping, getCustomizationGroupsForProduct } from "./utils";

const CustomizationRenderer = (props) => {
  const {
    productPayload,
    customization_state,
    setCustomizationState,
    selectedCustomizations = null,
    setItemOutOfStock,
  } = props;

  const classes = useStyles();
  const [isInitialized, setIsInitialized] = useState(false);
  const [customizationGroups, setCustomizationGroups] = useState([]);
  const [customizations, setCustomizations] = useState([]);
  const [highestSeq, setHighestSeq] = useState(0);

  const [customizationToGroupMap, setCustomizationToGroupMap] = useState({});
  const [groupToCustomizationMap, setGroupToCustomizationMap] = useState({});

  console.log("customizations", customizations);
  console.log("customizationsGroup", customizationGroups);

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
      const vegNonVegTag = itemDetails.tags.find((tag) => tag.code === "veg_nonveg");
      const isDefaultTag = parentTag.list.find((tag) => tag.code === "default");
      const isDefault = isDefaultTag?.value.toLowerCase() === "yes";
      const childTag = itemDetails.tags.find((tag) => tag.code === "child");
      const childs = childTag?.list.map((item) => item.value);

      return {
        id: itemDetails.id,
        name: itemDetails.descriptor.name,
        price: itemDetails.price.value,
        inStock: itemDetails.quantity.available.count > 0,
        parent: parentTag ? parentTag.list.find((tag) => tag.code === "id").value : null,
        child: childTag ? childTag.list.find((tag) => tag.code === "id").value : null,
        childs: childs?.length > 0 ? childs : null,
        isDefault: isDefault ?? false,
        vegNonVeg: vegNonVegTag ? vegNonVegTag.list[0].code : "",
      };
    });
    return customizations;
  };

  function findMinMaxSeq(customizationGroups) {
    if (!customizationGroups || customizationGroups.length === 0) {
      return { minSeq: undefined, maxSeq: undefined };
    }

    let minSeq = Infinity;
    let maxSeq = -Infinity;

    customizationGroups.forEach((group) => {
      const seq = group.seq;
      if (seq < minSeq) {
        minSeq = seq;
      }
      if (seq > maxSeq) {
        maxSeq = seq;
      }
    });

    return { minSeq, maxSeq };
  }

  useEffect(() => {
    if (productPayload) {
      const { customisation_groups, customisation_items } = productPayload;
      const customGroup = productPayload.item_details.tags.find((item) => item.code == "custom_group");
      if (customGroup && customGroup.list.length > 0) {
        const customizationGroupIds = customGroup?.list.map((item) => item.value);
        const filteredGroups = getCustomizationGroupsForProduct(customisation_groups, customizationGroupIds);
        setCustomizationGroups(formatCustomizationGroups(filteredGroups));
      } else {
        setCustomizationGroups([]);
      }
      setCustomizations(formatCustomizations(customisation_items));
    }
  }, [productPayload]);

  useEffect(() => {
    const mappings = createCustomizationAndGroupMapping(customizations);
    setCustomizationToGroupMap(mappings.customizationToGroupMap);
    setGroupToCustomizationMap(mappings.groupToCustomizationMap);
  }, [customizationGroups, customizations]);

  useEffect(() => {
    if (selectedCustomizations === null) {
      const initializeCustomizationState = () => {
        const minSeq = findMinMaxSeq(customizationGroups).minSeq;
        const firstGroup = customizationGroups.find((group) => group.seq === minSeq);
        const customization_state = { firstGroup };

        const processGroup = (id) => {
          const group = customizationGroups.find((item) => item.id === id);
          const groupId = group.id;
          const groupName = group.name;
          const isMandatory = group.minQuantity > 0;

          customization_state[groupId] = {
            id: groupId,
            name: groupName,
            seq: group.seq,
            options: [],
            selected: [],
            childs: [],
            isMandatory,
            type: group.maxQuantity > 1 ? "Checkbox" : "Radio",
          };

          const childCustomizations = customizations.filter((customization) => customization.parent === groupId);

          customization_state[groupId].options = childCustomizations;
          customization_state[groupId].selected = findSelectedCustomizationForGroup(
            customization_state[groupId],
            childCustomizations
          );

          let childGroups =
            customization_state[groupId].selected[0]?.id != undefined
              ? customizationToGroupMap[customization_state[groupId].selected[0]?.id]
              : [];
          customization_state[groupId].childs = childGroups;

          if (childGroups) {
            for (const childGroup of childGroups) {
              processGroup(childGroup);
            }
          }
        };

        if (firstGroup) {
          processGroup(firstGroup.id);
          setCustomizationState(customization_state);
        }
      };

      initializeCustomizationState();
    }
  }, [customizationGroups, customizations, customizationToGroupMap]);

  const findSelectedCustomizationForGroup = (group, childCustomizations) => {
    if (!group.isMandatory) return [];
    let selected_groups = [];
    let defaultCustomization = childCustomizations.filter(
      (customization) => customization.isDefault && customization.inStock
    );

    if (defaultCustomization.length) {
      selected_groups = defaultCustomization;
    } else {
      selected_groups = childCustomizations.find((customization) => customization.inStock) || [];
    }

    let is_item_out_of_stock = true;
    if (selected_groups.length) is_item_out_of_stock = false;

    setItemOutOfStock(is_item_out_of_stock);
    return selected_groups;
  };

  const processGroup = (groupId, updatedCustomizationState1, selectedGroup, selectedOption) => {
    const currentGroup = customizationGroups.find((item) => item.id === groupId);
    if (!currentGroup) return;

    const groupName = currentGroup.name;
    const isMandatory = currentGroup.minQuantity > 0;

    const currentGroupOldState = updatedCustomizationState1[currentGroup.id];

    updatedCustomizationState1[groupId] = {
      id: groupId,
      name: groupName,
      seq: currentGroup.seq,
      options: [],
      selected: [],
      childs: [],
      isMandatory,
      type: "Checkbox",
    };
    updatedCustomizationState1[groupId].options = [];

    const childCustomizations = customizations.filter((customization) => customization.parent === groupId);
    updatedCustomizationState1[groupId].options = childCustomizations;

    let childGroups = [];
    if (currentGroup.id === selectedGroup.id) {
      console.log("**1");
      let new_selected_options = [];
      // if option is there then remove it here
      if (!isMandatory && currentGroupOldState.selected.find((optn) => optn.id == selectedOption.id)) {
        new_selected_options = [...currentGroupOldState["selected"]].filter((item) => item.id != selectedOption.id);
        updatedCustomizationState1[groupId].selected = new_selected_options;
      } else {
        console.log("**2");
        // if option is not there then add it only if length is less than max Qty
        if (currentGroup.maxQuantity === 1) {
          childGroups = customizationToGroupMap[selectedOption.id];
          updatedCustomizationState1[groupId].selected = [selectedOption];
          console.log("**3", childGroups, selectedOption);
        } else {
          console.log("**4");
          if (currentGroup.maxQuantity > 1 && currentGroupOldState.selected.length < currentGroup.maxQuantity) {
            console.log("**5");
            new_selected_options = [...currentGroupOldState["selected"], selectedOption];
            updatedCustomizationState1[groupId].selected = new_selected_options;
          } else {
            console.log("**6");
            updatedCustomizationState1[groupId].selected = currentGroupOldState.selected;
          }
        }
      }

      updatedCustomizationState1[groupId].childs = childGroups;
    } else {
      const selectedCustomization = findSelectedCustomizationForGroup(
        updatedCustomizationState1[groupId],
        childCustomizations
      );

      console.log("selecetd cus", selectedCustomization);

      updatedCustomizationState1[groupId].selected = selectedCustomization;

      if (selectedCustomization.length) {
        childGroups = customizationToGroupMap[selectedCustomization[0].id];
        updatedCustomizationState1[groupId].childs = childGroups;
      }
    }

    //  updatedCustomizationState1[groupId].childs = childGroups;

    // Recursively process child groups
    for (const childGroup of childGroups) {
      processGroup(childGroup, updatedCustomizationState1, selectedGroup, selectedOption);
    }

    return updatedCustomizationState1;
  };

  const handleClick = (group, selectedOption) => {
    let updatedCustomizationState = { ...customization_state };
    let updatedState = processGroup(group.id, updatedCustomizationState, group, selectedOption);
    setCustomizationState(updatedState);
  };

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

  const renderGroup = (param) => {
    const group = customization_state[param?.id];

    return (
      <Accordion key={group?.id} elevation={0} square defaultExpanded sx={{ margin: 0, minHeight: 48 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ padding: 0, margin: 0 }}>
          <Typography variant="body" color="black">
            {group?.name}
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ padding: "20px 0" }}>
          <Grid sx={{ backgroundColor: "#F3F9FE", padding: "20px" }}>
            {group?.options?.map((option) => {
              const selected = group?.selected?.some((selectedOption) => selectedOption?.id === option?.id);
              return (
                <>
                  <FormControlLabel
                    className={classes.formControlLabel}
                    onClick={() => {
                      if (option.inStock) {
                        handleClick(group, option);
                      }
                    }}
                    control={
                      //  group.type === "Checkbox" ? (
                      //    <Checkbox checked={selected} disabled={!option.inStock} />
                      //  ) : (
                      //    <Radio checked={selected} disabled={!option.inStock} />
                      //  )
                      <Checkbox checked={selected} disabled={!option.inStock} />
                    }
                    label={
                      <>
                        <div
                          className={classes.radioTypoContainer}
                          //  onClick={() => handleClick(group, option)}
                        >
                          {renderVegNonVegTag(option.vegNonVeg)}
                          <Typography component="span" variant="body1" sx={{ fontWeight: 600, flex: 1 }}>
                            {option.name}
                          </Typography>

                          {!option.inStock && (
                            <div
                              style={{
                                border: "1px solid #D83232",
                                padding: "2px 8px",
                                borderRadius: "6px",
                              }}
                            >
                              <Typography color="#D83232" variant="subtitle1">
                                Out of Stock
                              </Typography>
                            </div>
                          )}
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: 600, marginRight: 2, minWidth: 50, textAlign: "right" }}
                          >
                            <CurrencyRupeeIcon sx={{ fontSize: 16, marginBottom: "2px" }} />
                            {option.price}
                          </Typography>
                        </div>
                      </>
                    }
                    labelPlacement="start"
                  />
                </>
              );
            })}
          </Grid>
        </AccordionDetails>
      </Accordion>
    );
  };

  let elements = [];
  const renderGroups = (group) => {
    if (!group) return;

    elements.push(renderGroup(group));

    let childs = customization_state[group?.id]?.childs;
    if (!childs) return;

    childs.map((child) => {
      renderGroups(customization_state[child]);
    });
  };

  const renderCustomizations = () => {
    const minSeq = findMinMaxSeq(customizationGroups).minSeq;
    const firstGroup = customizationGroups.find((group) => group.seq === minSeq);
    renderGroups(firstGroup);

    const renderGroup = (param) => {
      const group = customization_state[param?.id];

      return (
        <Accordion key={group?.id} elevation={0} square defaultExpanded sx={{ margin: 0, minHeight: 48 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ padding: 0, margin: 0 }}>
            <Typography variant="body" color="black">
              {group?.name}
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ padding: "20px 0" }}>
            <Grid sx={{ backgroundColor: "#F3F9FE", padding: "20px" }}>
              {group?.options?.map((option) => {
                const selected = group?.selected?.some((selectedOption) => selectedOption?.id === option?.id);
                return (
                  <>
                    <FormControlLabel
                      className={classes.formControlLabel}
                      onClick={() => handleClick(group, option)}
                      control={
                        group.seq === highestSeq ? (
                          <Checkbox checked={selected} disabled={!option.inStock} />
                        ) : (
                          <Radio checked={selected} disabled={!option.inStock} />
                        )
                      }
                      label={
                        <>
                          <div className={classes.radioTypoContainer} onClick={() => handleClick(group, option)}>
                            {renderVegNonVegTag(option.vegNonVeg)}
                            <Typography component="span" variant="body1" sx={{ fontWeight: 600, flex: 1 }}>
                              {option.name}
                            </Typography>

                            {!option.inStock && (
                              <div
                                style={{
                                  border: "1px solid #D83232",
                                  padding: "2px 8px",
                                  borderRadius: "6px",
                                }}
                              >
                                <Typography color="#D83232" variant="subtitle1">
                                  Out of Stock
                                </Typography>
                              </div>
                            )}
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 600, marginRight: 2, minWidth: 50, textAlign: "right" }}
                            >
                              <CurrencyRupeeIcon sx={{ fontSize: 16, marginBottom: "2px" }} />
                              {option.price}
                            </Typography>
                          </div>
                        </>
                      }
                      labelPlacement="start"
                    />
                  </>
                );
              })}
            </Grid>
          </AccordionDetails>
        </Accordion>
      );
    };

    return (
      <div>
        {/* {renderGroup(currentGroup)} */}

        {elements}

        {/* {firstGroup && renderGroup(firstGroup)} */}
        {/* {firstGroup &&
          customization_state[firstGroup?.id]?.childs?.map((childGroupId) => {
            const childGroup = customization_state[childGroupId];
            return childGroup && renderGroup(childGroup);
          })} */}
      </div>
    );
  };

  return <>{renderCustomizations()}</>;
};

export default CustomizationRenderer;
