import React, { useEffect, useState } from "react";
import useStyles from "./style";
import { Grid, Typography } from "@mui/material";
import { Link, useHistory } from "react-router-dom";
import RightArrowIcon from "@mui/icons-material/ArrowForwardRounded";

import ModalComponent from "../../../common/Modal";

const VariationsRenderer = (props) => {
  const { productPayload, variationState, setVariationState, chartImage = "", isFashion = false } = props;
  const classes = useStyles();
  const history = useHistory();

  const [variationGroups, setVariationGroups] = useState([]);
  const [variations, setVariations] = useState([]);
  const [initialVariationState, setInitialVariationState] = useState({});
  const [isUOM, setIsUOM] = useState(false);
  const [openSizeChart, setOpenSizeChart] = useState(false);
  const [noVariations, setNoVariations] = useState(false);

  const getVariationGroups = () => {
    const parentId = productPayload.item_details.parent_item_id;
    const parentData = productPayload.categories.find((item) => item.id === parentId);

    if (parentData) {
      const attrTags = productPayload.categories[0].tags;
      const groupInfo = new Set(); // Use a Set to store unique items

      for (const tag of parentData.tags) {
        if (tag.code === "attr") {
          const nameTag = tag.list.find((item) => item.code === "name");
          const seqTag = tag.list.find((item) => item.code === "seq");

          if (nameTag && seqTag) {
            const nameParts = nameTag.value.split(".");
            const name = nameParts[nameParts.length - 1];
            const seq = parseInt(seqTag.value);

            const item = { name, seq };

            // Convert the object to a JSON string to ensure uniqueness
            const itemString = JSON.stringify(item);

            // Check if the item already exists in the Set
            if (!groupInfo.has(itemString)) {
              // If it doesn't exist, add it to the Set
              groupInfo.add(itemString);
            }

            const uniqueGroupInfo = Array.from(groupInfo).map((itemString) => JSON.parse(itemString));
            setVariationGroups(uniqueGroupInfo);
            getRelatedVariations(uniqueGroupInfo);
            getInitialVariationState(uniqueGroupInfo);
          }
        }
      }
    } else {
      setNoVariations(true);
    }
  };

  const getInitialVariationState = (groupInfo) => {
    const parentId = productPayload.item_details.parent_item_id;

    const tags = productPayload.categories.find((item) => item.id == parentId)?.tags;
    const attr = tags?.find((tag) => tag.code === "attr");
    const name = attr?.list.find((a) => a.code === "name");

    if (name?.value === "item.quantity.unitized.measure") {
      setInitialVariationState({ isUOM: true });
      setIsUOM(true);
    } else {
      setIsUOM(false);
      const newState = {};
      groupInfo.forEach((group) => {
        const attributeName = group.name;
        const attributeValue = productPayload.attributes[attributeName];
        newState[attributeName] = attributeValue;
      });
      setInitialVariationState(newState);
    }
  };

  const getRelatedVariations = (variations) => {
    const relatedItems = productPayload?.related_items?.map((item) => {
      const attributes = item.attributes;
      const variationsInfo = {};
      variations.forEach((variation) => {
        variationsInfo[variation?.name] = attributes[variation?.name];
      });
      return {
        id: item.id,
        price: item.item_details.price.value,
        img: item.item_details.descriptor.symbol,
        ...variationsInfo,
      };
    });

    setVariations(relatedItems);
  };

  const findGroupJustBeforeLast = () => {
    // Find the last group in variationGroups
    const lastGroup = variationGroups[variationGroups.length - 1];

    // Iterate through variationState
    for (const groupId in variationState) {
      if (variationState.hasOwnProperty(groupId)) {
        const group = variationState[groupId];

        // Check if the current group's ID is one less than the ID of the last group
        if (group.id === lastGroup.seq - 1) {
          return group; // This is the group just before the last group
        }
      }
    }

    return null; // If not found
  };

  const findMatchingVariation = () => {
    // Iterate through variations
    for (const variation of variations) {
      let isMatch = true;

      // Iterate through variationState
      for (const groupId in variationState) {
        if (variationState.hasOwnProperty(groupId)) {
          const groupData = variationState[groupId];
          const groupName = groupData.name;
          const selectedOption = groupData.selected[0];

          // Check if the variation matches the values in variationState
          if (variation[groupName] !== selectedOption) {
            isMatch = false;
            break; // No need to continue checking
          }
        }
      }

      // If all values in variationState matched this variation, return it
      if (isMatch) {
        return variation;
      }
    }

    return null; // No matching variation found
  };

  const handleVariationClick = (groupData, option) => {
    const groupJustBeforeLast = findGroupJustBeforeLast();

    let updatedVariationState = { ...variationState };
    groupData.selected = [option];
    updatedVariationState[groupData.id] = groupData;

    if (groupData.id === Object.keys(variationState).length) {
      const matchingVariation = findMatchingVariation();
      if (matchingVariation) {
        history.push(`/application/products/${matchingVariation.id}`);
      }
    }

    const isLastGroup = groupData.id === Object.keys(variationState).length;
    if (!isLastGroup) {
      const lastGroupId = Object.keys(variationState).length;
      updatedVariationState[lastGroupId].selected = [];
    }

    variationGroups.forEach((group, index) => {
      const groupName = group.name;
      const groupId = group.seq;

      const newGroupData = {
        id: groupId,
        name: groupName,
        selected: [updatedVariationState[index + 1].selected[0]],
        options: [],
      };

      if (index + 1 === 1) {
        variations.forEach((variation) => {
          newGroupData.productId = variation.productId;
          if (!newGroupData.options.includes(variation[groupName])) {
            newGroupData.options.push(variation[groupName]);
          }
        });
      } else {
        const prevGroupName = updatedVariationState[index].name;
        const prevGroupSelection = updatedVariationState[index].selected[0];

        variations.forEach((variation) => {
          //  newGroupData.productId = variation.productId;
          if (variation[prevGroupName] === prevGroupSelection) {
            if (!newGroupData.options.includes(variation[groupName])) {
              newGroupData.options.push(variation[groupName]);
            }
          }
        });
      }

      updatedVariationState[groupId] = newGroupData;
    });

    setVariationState(updatedVariationState);
  };

  const handleUOMClick = (groupData, option) => {
    const toFind = option.split(" ")[0];
    const product = productPayload.related_items.find((item) => {
      const value = item.item_details.quantity.unitized.measure.value;
      if (parseInt(value) === parseInt(toFind)) return item;
    });

    history.push(`/application/products/${product?.id}`);
  };

  useEffect(() => {
    if (productPayload) {
      getVariationGroups();
    }
  }, [productPayload]);

  // initialize variaitions state.
  useEffect(() => {
    if (variationGroups && initialVariationState) {
      const result = {};

      variationGroups.forEach((group, index) => {
        const groupName = group.name;
        const groupId = group.seq;

        let groupData = {
          id: groupId,
          productId: "",
          name: groupName,
          selected: [],
          options: [],
        };

        if (initialVariationState?.isUOM == true) {
          const selectedOption = productPayload.item_details.quantity.unitized?.measure;
          groupData.selected = [`${selectedOption.value} ${selectedOption.unit}`];

          productPayload.related_items.map((item) => {
            const option = item.item_details.quantity.unitized.measure;
            groupData.options.push(`${option.value} ${option.unit}`);
          });
        } else {
          groupData.selected = [initialVariationState[groupName]];

          if (index === 0) {
            variations.forEach((variation) => {
              groupData.productId = variation.id;

              if (!groupData.options.includes(variation[groupName])) {
                groupData.options.push(variation[groupName]);
              }
            });
          } else {
            const prevGroupName = variationGroups[index - 1].name;
            const prevGroupSelection = initialVariationState[prevGroupName];

            variations.forEach((variation) => {
              groupData.productId = variation.id;
              if (variation[prevGroupName] === prevGroupSelection) {
                if (!groupData.options.includes(variation[groupName])) {
                  groupData.options.push(variation[groupName]);
                }
              }
            });
          }
        }
        result[groupId] = groupData;
      });

      // console.log(result);

      setVariationState(result);
    }
  }, [variationGroups, initialVariationState, variations]);

  const renderVariations = () => {
    return Object.keys(variationState).map((groupId) => {
      const groupData = variationState[groupId];
      const groupName = groupData.name;
      return (
        <div key={groupId}>
          <Typography variant="body" color="black" sx={{ fontWeight: 500, textTransform: "capitalize" }}>
            Available {groupName} Options
            {groupName === "size" && isFashion && (
              <span onClick={() => setOpenSizeChart(true)} className={classes.sizeChart}>
                Size Guide <RightArrowIcon />
              </span>
            )}
          </Typography>
          <Grid container>
            {groupData.options.map((option) => {
              return (
                <div
                  key={option}
                  className={
                    groupData.selected.includes(option) ? classes.selectedCustomization : classes.customization
                  }
                  style={{ marginTop: "8px", marginBottom: "16px" }}
                  onClick={() => {
                    if (isUOM) {
                      handleUOMClick(groupData, option);
                    } else {
                      handleVariationClick(groupData, option);
                    }
                  }}
                >
                  <Typography variant="body1" color={groupData.selected.includes(option) ? "white" : "#686868"}>
                    {option}
                  </Typography>
                </div>
              );
            })}
          </Grid>
          {openSizeChart && chartImage && (
            <ModalComponent
              open={openSizeChart}
              onClose={() => {
                setOpenSizeChart(false);
              }}
              title="Size Chart"
            >
              <div className={classes.sizeChartContainer}>
                <img className={classes.sizeChartImage} src={chartImage} alt="size-chart" />
              </div>
            </ModalComponent>
          )}
        </div>
      );
    });
  };

  return <>{renderVariations()}</>;
};

export default VariationsRenderer;
