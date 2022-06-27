import { ONDC_COLORS } from "../colors";

export const buttonSize = {
  small: "small",
  medium: "medium",
  large: "large",
};

export const buttonTypes = {
  primary: "primary",
  primary_hover: "primary_hover",
  secondary: "secondary",
  secondary_hover: "secondary_hover",
  success: "success",
  success_hover: "success_hover",
  danger: "danger",
  danger_hover: "danger_hover",
};

export function getButtonStyle(type) {
  switch (type) {
    case buttonTypes.primary:
      return {
        backgroundColor: ONDC_COLORS.WHITE,
        border: `1px solid ${ONDC_COLORS.ACCENTCOLOR}`,
        transition: "all 0.3s",
        buttonTextColor: ONDC_COLORS.ACCENTCOLOR,
      };

    case buttonTypes.primary_hover:
      return {
        backgroundColor: ONDC_COLORS.ACCENTCOLOR,
        border: 0,
        transition: "all 0.3s",
        buttonTextColor: ONDC_COLORS.WHITE,
      };

    case buttonTypes.secondary:
      return {
        backgroundColor: ONDC_COLORS.WHITE,
        border: `1px solid ${ONDC_COLORS.SECONDARYCOLOR}`,
        transition: "all 0.3s",
        buttonTextColor: ONDC_COLORS.SECONDARYCOLOR,
      };

    case buttonTypes.secondary_hover:
      return {
        backgroundColor: ONDC_COLORS.SECONDARYCOLOR,
        border: 0,
        transition: "all 0.3s",
        buttonTextColor: ONDC_COLORS.WHITE,
      };

    case buttonTypes.success:
      return {
        backgroundColor: ONDC_COLORS.WHITE,
        border: `1px solid ${ONDC_COLORS.SUCCESS}`,
        transition: "all 0.3s",
        buttonTextColor: ONDC_COLORS.SUCCESS,
      };

    case buttonTypes.success_hover:
      return {
        backgroundColor: ONDC_COLORS.SUCCESS,
        border: 0,
        transition: "all 0.3s",
        buttonTextColor: ONDC_COLORS.WHITE,
      };

    case buttonTypes.danger:
      return {
        backgroundColor: ONDC_COLORS.WHITE,
        border: `1px solid ${ONDC_COLORS.ERROR}`,
        transition: "all 0.3s",
        buttonTextColor: ONDC_COLORS.ERROR,
      };

    case buttonTypes.danger_hover:
      return {
        backgroundColor: ONDC_COLORS.ERROR,
        border: 0,
        transition: "all 0.3s",
        buttonTextColor: ONDC_COLORS.WHITE,
      };

    default:
      return {
        backgroundColor: ONDC_COLORS.WHITE,
        border: `1px solid ${ONDC_COLORS.ACCENTCOLOR}`,
        transition: "all 0.3s",
        buttonTextColor: ONDC_COLORS.ACCENTCOLOR,
      };
  }
}
