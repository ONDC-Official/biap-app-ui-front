export const formatCustomizations = async (customisation_items) => {
  const customizations = customisation_items?.map((customization) => {
    const itemDetails = customization.item_details;
    const parentTag = itemDetails.tags.find((tag) => tag.code === "parent");
    const childTag = itemDetails.tags.find((tag) => tag.code === "child");
    const vegNonVegTag = itemDetails.tags.find((tag) => tag.code === "veg_nonveg");
    const isDefault = parentTag.list.find((tag) => tag.code === "default");

    return {
      id: itemDetails.id,
      name: itemDetails.descriptor.name,
      price: itemDetails.price.value,
      inStock: itemDetails.quantity.available.count > 0,
      isDefault: isDefault.value === "Yes" || isDefault.value === "yes" ? true : false,
      parent: parentTag ? parentTag.list.find((tag) => tag.code === "id").value : null,
      child: childTag ? childTag.list.find((tag) => tag.code === "id").value : null,
      vegNonVeg: vegNonVegTag ? vegNonVegTag.list[0].code : "",
    };
  });
  return customizations;
};

export const formatCustomizationGroups = async (customisation_groups) => {
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

export const initializeCustomizationState = async (customizationGroups, customizations, customization_state) => {
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
