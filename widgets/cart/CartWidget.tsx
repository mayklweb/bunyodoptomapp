import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import Container from "@/components/Container";

import CartEmpty from "@/components/cart/CartEmpty";
import CartItem from "@/components/cart/CartItem";
import CartSelectAll from "@/components/cart/CartSelectAll";

import { CartRowItem } from "@/types/cart";

type Props = {
  cart: CartRowItem[];
  selectedIds: (string | number)[];
  isAllSelected: boolean;

  onToggleAll: () => void;
  onToggleItem: (id: string | number) => void;
  onIncrease: (id: string | number) => void;
  onDecrease: (id: string | number) => void;
  onRemove: (id: string | number) => void;
  onClear: () => void;
  onCatalogPress: () => void;
};

export default function CartWidget({
  cart,
  selectedIds,
  isAllSelected,
  onToggleAll,
  onToggleItem,
  onIncrease,
  onDecrease,
  onRemove,
  onClear,
  onCatalogPress,
}: Props) {
  const selectedIdSet = new Set(selectedIds);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <Container>
          {cart.length === 0 ? (
            <CartEmpty onCatalogPress={onCatalogPress} />
          ) : (
            <View style={{ paddingVertical: 24 }}>
              <CartSelectAll
                selectedCount={selectedIds.length}
                isAllSelected={isAllSelected}
                onToggleAll={onToggleAll}
                onClear={onClear}
              />

              {cart.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  isSelected={selectedIdSet.has(item.id)}
                  onToggle={onToggleItem}
                  onIncrease={onIncrease}
                  onDecrease={onDecrease}
                  onRemove={onRemove}
                />
              ))}
            </View>
          )}
        </Container>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scroll: {
    flex: 1,
  },

  contentContainer: {
    paddingBottom: 24,
  },
  scrollContent: { flexGrow: 1 },

  content: {
    paddingVertical: 24,
  },
});
