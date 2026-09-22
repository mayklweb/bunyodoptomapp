import React, { isValidElement, cloneElement, useState } from "react";
import {
  TextInput,
  TextInputProps,
  Text,
  View,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from "react-native";

type InputProps = TextInputProps & {
  label?: string;
  error?: string;
  icon?: React.ReactElement<{ size?: number; color?: string }>;
  iconPosition?: "left" | "right";
  onIconPress?: () => void;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputContainerStyle?: ViewStyle;
  ref?: React.Ref<TextInput>;
};

export default function Input({
  ref,
  label,
  error,
  icon,
  iconPosition = "left",
  onIconPress,
  containerStyle,
  labelStyle,
  inputContainerStyle,
  style,
  onFocus,
  onBlur,
  placeholderTextColor,
  ...rest
}: InputProps) {
  const [focused, setFocused] = useState(false);

  const borderColor = error ? "#FF3B30" : focused ? "#007AFF" : "#E5E5E5";
  const iconColor = error ? "#FF3B30" : focused ? "#007AFF" : "#8E8E93";

  const renderedIcon =
    icon && isValidElement(icon)
      ? cloneElement(icon, {
          size: icon.props.size ?? 22,
          color: icon.props.color ?? iconColor,
        })
      : null;

  const IconWrapper = onIconPress ? TouchableOpacity : View;

  return (
    <View style={[{ marginBottom: 4 }, containerStyle]}>
      {label && (
        <Text
          style={[
            {
              fontSize: 14,
              fontWeight: "500",
              color: "#1C1C1C",
              marginBottom: 6,
            },
            labelStyle,
          ]}
        >
          {label}
        </Text>
      )}

      <View
        style={[
          {
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderColor,
            borderRadius: 12,
            paddingHorizontal: 12,
            backgroundColor: "#FFF",
            gap: 12,
          },
          inputContainerStyle,
        ]}
      >
        {renderedIcon && iconPosition === "left" && (
          <IconWrapper onPress={onIconPress} hitSlop={8}>
            {renderedIcon}
          </IconWrapper>
        )}

        <TextInput
          ref={ref}
          style={[
            { flex: 1, fontSize: 16, paddingVertical: 11.5 },
            style,
          ]}
          placeholderTextColor={placeholderTextColor ?? "#8E8E93"}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />

        {renderedIcon && iconPosition === "right" && (
          <IconWrapper onPress={onIconPress} hitSlop={8}>
            {renderedIcon}
          </IconWrapper>
        )}
      </View>

      {error && (
        <Text style={{ fontSize: 12, color: "#FF3B30", marginTop: 4 }}>
          {error}
        </Text>
      )}
    </View>
  );
}
