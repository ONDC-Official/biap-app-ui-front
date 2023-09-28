export const formatCustomizations = (customisation_items) => {
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

export const formatCustomizationGroups = (customisation_groups) => {
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

export const getCustomizationGroupsForProduct = (allGroups, ids) => {
  return allGroups.filter((g) => {
    return ids.includes(g.local_id);
  });
};

export const hasCustomizations = (productPayload) => {
  return productPayload.item_details.tags.find((item) => item.code === "custom_group") ? true : false;
};

export const initializeCustomizationState_ = async (customizationGroups, customizations, customization_state) => {
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
          inputType: group?.inputType,
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

    return newState;
  }
  return {};
};

export const createCustomizationAndGroupMapping = (customizations) => {
  let newCustomizationGroupMappings = {};
  let customizationToGroupMap = {};
  customizations.forEach((customization) => {
    const groupId = customization.parent;
    const childId = customization.id;

    customizationToGroupMap = {
      ...customizationToGroupMap,
      [customization.id]: customization.childs == undefined ? [] : customization.childs,
    };

    if (!newCustomizationGroupMappings[groupId]) {
      newCustomizationGroupMappings[groupId] = new Set();
    }
    newCustomizationGroupMappings[groupId].add(childId);
  });

  const finalizedCustomizationGroupMappings = {};
  for (const groupId in newCustomizationGroupMappings) {
    finalizedCustomizationGroupMappings[groupId] = Array.from(newCustomizationGroupMappings[groupId]);
  }

  return {
    customizationToGroupMap,
    groupToCustomizationMap: finalizedCustomizationGroupMappings,
  };
};

export function findMinMaxSeq(customizationGroups) {
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

export const findSelectedCustomizationForGroup = (group, childCustomizations) => {
  if (!group.isMandatory) return [];
  let defaultCustomization = childCustomizations.filter(
    (customization) => customization.isDefault && customization.inStock
  );

  if (defaultCustomization.length) {
    return defaultCustomization;
  } else {
    return [childCustomizations.find((customization) => customization.inStock)];
  }
};

export const initializeCustomizationState = async (customizationGroups, customizations, customization_state) => {
  const mappings = createCustomizationAndGroupMapping(customizations);
  const customizationToGroupMap = mappings.customizationToGroupMap;
  const minSeq = findMinMaxSeq(customizationGroups).minSeq;
  const firstGroup = customizationGroups.find((group) => group.seq === minSeq);
  customization_state = { firstGroup };

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
    return customization_state;
  }
};
