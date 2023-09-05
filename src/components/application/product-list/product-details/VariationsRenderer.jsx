import React, { useEffect, useState } from "react";
import useStyles from "./style";
import { Grid, Typography } from "@mui/material";
import { Link, useHistory } from "react-router-dom";

const VariationsRenderer = (props) => {
  const { productPayload, variationState, setVariationState } = props;
  const classes = useStyles();
  const history = useHistory();

  const [currentProductId, setCurrentProductId] = useState("");
  const [variationGroups, setVariationGroups] = useState([]);
  const [variations, setVariations] = useState([]);
  const [initialVariationState, setInitialVariationState] = useState({});

  const getVariationGroups = () => {
    const attrTags = productPayload.categories[0].tags;
    const groupInfo = [];

    for (const tag of attrTags) {
      if (tag.code === "attr") {
        const nameTag = tag.list.find((item) => item.code === "name");
        const seqTag = tag.list.find((item) => item.code === "seq");

        if (nameTag && seqTag) {
          const nameParts = nameTag.value.split(".");
          const name = nameParts[nameParts.length - 1];
          const seq = parseInt(seqTag.value);

          groupInfo.push({ name, seq });
        }
      }
    }

    setVariationGroups(groupInfo);
    getRelatedVariations(groupInfo);
    getInitialVariationState(groupInfo);
  };

  const getInitialVariationState = (groupInfo) => {
    const newState = {};
    groupInfo.forEach((group) => {
      const attributeName = group.name;
      const attributeValue = productPayload.attributes[attributeName];
      newState[attributeName] = attributeValue;
    });
    setInitialVariationState(newState);
  };

  const getRelatedVariations = (variations) => {
    const relatedItems = productPayload.related_items.map((item) => {
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
      } else if (groupJustBeforeLast.id === groupData.id) {
        const prevGroupName = updatedVariationState[index].name;
        const prevGroupSelection = updatedVariationState[index].selected[0];
        if (productPayload.attributes[groupName] === option) {
          newGroupData.selected = [option];
        } else {
          newGroupData.selected = [];
        }

        variations.forEach((variation) => {
          //  newGroupData.productId = variation.productId;
          if (variation[prevGroupName] === prevGroupSelection) {
            if (!newGroupData.options.includes(variation[groupName])) {
              newGroupData.options.push(variation[groupName]);
            }
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

  useEffect(() => {
    if (productPayload) {
      getVariationGroups();
      setCurrentProductId(productPayload.id);
    }
  }, [productPayload]);

  useEffect(() => {
    if (currentProductId != "") {
      history.push(`/application/products/${currentProductId}`);
    }
  }, [currentProductId]);

  // initialize variaitions state.
  useEffect(() => {
    if (variationGroups && initialVariationState) {
      const result = {};

      variationGroups.forEach((group, index) => {
        const groupName = group.name;
        const groupId = group.seq;

        const groupData = {
          id: groupId,
          productId: "",
          name: groupName,
          selected: [initialVariationState[groupName]],
          options: [],
        };

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

        result[groupId] = groupData;
      });

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
                    handleVariationClick(groupData, option);
                  }}
                >
                  <Typography variant="body1" color={groupData.selected.includes(option) ? "white" : "#686868"}>
                    {option}
                  </Typography>
                </div>
              );
            })}
          </Grid>
        </div>
      );
    });
  };

  return <>{renderVariations()}</>;
};

export default VariationsRenderer;
