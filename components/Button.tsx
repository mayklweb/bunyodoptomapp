import React, { isValidElement, cloneElement } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

type ButtonProps = {
  title?: string;
  onPress?: () => void;
  icon?: React.ReactElement<{ size?: number; color?: string }>;
  iconPosition?: "left" | "right";
  color?: string;
  backgroundColor?: string;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

export default function Button({
  title,
  onPress,
  icon,
  iconPosition = "left",
  color = "#007AFF",
  backgroundColor = "#FFF",
  disabled = false,
  loading = false,
  style,
  textStyle,
}: ButtonProps) {
  const isIconOnly = !title && !!icon;

  const renderedIcon =
    icon && isValidElement(icon)
      ? cloneElement(icon, {
          size: icon.props.size,
          color: icon.props.color ?? color,
        })
      : null;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.button,
        isIconOnly ? styles.iconOnly : styles.withText,
        {
          backgroundColor,
          gap: icon && title ? 8 : 0,
        },
        disabled || loading ? styles.disabled : null,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={color} />
      ) : (
        <>
          {renderedIcon && iconPosition === "left" && renderedIcon}
          {title ? (
            <Text style={[styles.text, { color }, textStyle]}>{title}</Text>
          ) : null}
          {renderedIcon && iconPosition === "right" && renderedIcon}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 44,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  withText: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  iconOnly: {
    width: 44,
    height: 44,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  text: {
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 20,
  },
  disabled: {
    opacity: 0.5,
  },
});