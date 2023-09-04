import React, { useEffect, useState } from "react";
import useStyles from "./style";
import { Grid, Typography } from "@mui/material";

const VariationsRenderer = (props) => {
  const { productPayload, variationState, setVariationState } = props;
  const classes = useStyles();

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
    console.log("initialVariationState:-", newState);
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
        id: item.item_details.id,
        price: item.item_details.price.value,
        img: item.item_details.descriptor.symbol,
        ...variationsInfo,
      };
    });

    setVariations(relatedItems);
    console.log("variation-groups:", variations);
    console.log("variations:", relatedItems);
  };

  const handleOptionClick = (groupData, option) => {
    let updatedVariationState = { ...variationState };
    groupData.selected = [option];

    updatedVariationState[groupData.id] = groupData;

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
          if (!newGroupData.options.includes(variation[groupName])) {
            newGroupData.options.push(variation[groupName]);
          }
        });
      } else {
        const prevGroupName = updatedVariationState[index].name;
        const prevGroupSelection = updatedVariationState[index].selected[0];

        variations.forEach((variation) => {
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
    if (productPayload) getVariationGroups();
  }, [productPayload]);

  // initialize variaitions state
  useEffect(() => {
    if (variationGroups && initialVariationState) {
      const result = {};

      variationGroups.forEach((group, index) => {
        const groupName = group.name;
        const groupId = group.seq;
        const groupData = {
          id: groupId,
          name: groupName,
          selected: [initialVariationState[groupName]],
          options: [],
        };

        if (index === 0) {
          variations.forEach((variation) => {
            if (!groupData.options.includes(variation[groupName])) {
              groupData.options.push(variation[groupName]);
            }
          });
        } else {
          const prevGroupName = variationGroups[index - 1].name;
          const prevGroupSelection = initialVariationState[prevGroupName];

          console.log("prevGroupName", prevGroupName, prevGroupSelection);
          variations.forEach((variation) => {
            if (variation[prevGroupName] === prevGroupSelection) {
              if (!groupData.options.includes(variation[groupName])) {
                groupData.options.push(variation[groupName]);
              }
            }
          });
        }

        result[groupId] = groupData;
      });

      console.log("VariationState:", result);
      setVariationState(result);
    }
  }, [variationGroups, initialVariationState, variations]);

  const renderVariations = () => {
    return Object.keys(variationState).map((groupId) => {
      const groupData = variationState[groupId];
      const groupName = groupData.name;

      return (
        <div key={groupId}>
          <Typography variant="body" color="black" sx={{ margin: "12px 0" }}>
            {groupName}
          </Typography>
          <Grid container>
            {groupData.options.map((option) => (
              <div
                key={option}
                className={groupData.selected.includes(option) ? classes.selectedCustomization : classes.customization}
                onClick={() => {
                  handleOptionClick(groupData, option);
                }}
              >
                <Typography variant="body1" color={groupData.selected.includes(option) ? "white" : "#686868"}>
                  {option}
                </Typography>
                {/* <Typography
                    variant="body1"
                    color={groupData.selected.includes(option) ? "white" : "#222"}
                    sx={{ fontSize: 16, fontWeight: 600 }}
                  >
                    <CurrencyRupeeIcon sx={{ fontSize: 16, marginBottom: "2px" }} />
                    {groupData.price[option]}
                  </Typography> */}
              </div>
            ))}
          </Grid>
        </div>
      );
    });
  };

  return <>{renderVariations()}</>;
};

export default VariationsRenderer;
