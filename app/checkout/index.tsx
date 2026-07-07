import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '@/hooks/useStore';
import { useCartStore } from '@/store/cart.store';
import { useAddress } from '@/hooks/useAddress';
import { useProfile } from '@/hooks/useProfile';
import { formatPhone } from '@/utils/helpres';
import { useCheckout } from '@/hooks/useOrder';

export default function CheckoutScreen() {
  const router = useRouter();
  const { data: store } = useStore();
  const { selectedItems, clearCart, total } = useCartStore();
  const { data: addresses } = useAddress();
  const { data: profile } = useProfile();

  
  
  const [selectedAddressId, setSelectedAddressId] = useState<number>(6);
  const [selectedMarketId, setSelectedMarketId] = useState<number>(10);
  const [paymentMethod, setPaymentMethod] = useState('cash');

  const { mutate: checkout, isPending } = useCheckout();
  
  const products = selectedItems().map((item) => ({
    ...item,
    qty: item.count ?? 1,
  }));
  
  const canCheckout = products.length > 0 && !!selectedAddressId && !!selectedMarketId;

  const onCheckout = () => {
    
    if (!canCheckout) return;

    // 👇 SHU YERGA QO‘YASAN
    const selectedAddress = addresses?.find((a: any) => a.id === selectedAddressId);

    const selectedMarket = store?.find((m: any) => m.id === selectedMarketId);
    // mutate signature from useCheckout may be typed to accept no args; cast to any to pass payload and options
    (checkout as any)(
      {
        user_id: parseInt(profile.id),
        total_amount: total(),
        address_id: selectedAddressId,
        market: selectedMarket,
        market_id: selectedMarketId,
        payment_method: paymentMethod,
        payed: false,
        status: 'preparing',
        products: products,
      },
      {
        onSuccess: () => {
          clearCart();
          router.replace('/profile');
        },
      }
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Buyurtmani tasdiqlash</Text>
      </View>

      {/* User */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Foydalanuvchi</Text>

        <View style={styles.userRow}>
          <View style={styles.avatar}>
            <Text style={{ fontSize: 20 }}>👤</Text>
          </View>

          <View>
            <Text style={styles.userName}>{profile?.name || 'Foydalanuvchi'}</Text>

            <Text style={styles.userPhone}>{formatPhone(profile?.phone)}</Text>
          </View>
        </View>
      </View>

      {/* Address */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Yetkazib berish manzili</Text>

        {addresses?.map((address: any) => (
          <TouchableOpacity
            key={address.id}
            onPress={() => setSelectedAddressId(address.id)}
            style={[styles.radioCard, selectedAddressId === address.id && styles.selectedCard]}>
            <View style={styles.radioCircle}>
              {selectedAddressId === address.id && <View style={styles.radioDot} />}
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.marketName}>
                {address.region}, {address.district}
              </Text>

              <Text style={styles.marketAddress}>{address.address}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Market */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Do'kon</Text>

        {store?.map((market: any) => (
          <TouchableOpacity
            key={market.id}
            onPress={() => setSelectedMarketId(market.id)}
            style={[styles.radioCard, selectedMarketId === market.id && styles.selectedCard]}>
            <View style={styles.radioCircle}>
              {selectedMarketId === market.id && <View style={styles.radioDot} />}
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.marketName}>{market.name}</Text>

              <Text style={styles.marketAddress}>
                {market.region}, {market.district}
              </Text>

              <Text style={styles.marketAddress}>{market.address}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Products */}
      <Text style={styles.sectionTitle}>Mahsulotlar ({products.length} dona)</Text>

      {products.map((item) => (
        <View key={item.id} style={styles.productRow}>
          <Image
            source={{
              uri: `https://api.bunyodoptom.uz${item.images?.[0]?.url}`,
            }}
            style={styles.productImage}
          />

          <View style={{ flex: 1 }}>
            <Text numberOfLines={2} style={styles.productName}>
              {item.name}
            </Text>

            <Text style={styles.productQty}>{item.count} dona</Text>

            <Text style={styles.productPrice}>
              {(item.price * item.count).toLocaleString()} so'm
            </Text>
          </View>
        </View>
      ))}

      {/* Payment */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>To'lov usuli</Text>

        {['cash', 'click'].map((method) => {
          const isDisabled = method === 'click';

          return (
            <TouchableOpacity
              key={method}
              disabled={isDisabled}
              onPress={() => setPaymentMethod(method)}
              style={[
                styles.radioCard,
                paymentMethod === method && styles.selectedCard,
                isDisabled && styles.disabledCard,
              ]}>
              <View style={[styles.radioCircle, isDisabled && styles.disabledRadioCircle]}>
                {paymentMethod === method && !isDisabled && <View style={styles.radioDot} />}
              </View>

              <Text style={[styles.paymentText, isDisabled && styles.disabledText]}>
                {method === 'cash' ? '💵 Naqd pul' : '💳 Click (tez kunda)'}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Total */}
      <View style={styles.card}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Jami summa</Text>

          <Text style={styles.totalPrice}>{total().toLocaleString()} so'm</Text>
        </View>

        <TouchableOpacity onPress={onCheckout} style={styles.checkoutBtn}>
          <Text style={styles.checkoutText}>Tasdiqlash — {total().toLocaleString()} so'm</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const PRIMARY = '#0040B1';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f5',
  },

  content: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },

  header: {
    marginBottom: 8,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#18181b',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 12,
    color: '#18181b',
  },

  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  userName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#18181b',
  },

  userPhone: {
    fontSize: 13,
    color: '#71717a',
    marginTop: 2,
  },

  radioCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderWidth: 1,
    borderColor: '#e4e4e7',
    borderRadius: 12,
    marginBottom: 8,
  },

  selectedCard: {
    borderColor: PRIMARY,
    backgroundColor: '#f0fdf4',
  },

  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },

  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: PRIMARY,
  },

  marketName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#18181b',
  },

  marketAddress: {
    fontSize: 13,
    color: '#71717a',
    marginTop: 4,
  },

  productRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },

  productImage: {
    width: 72,
    height: 72,
    borderRadius: 12,
    marginRight: 12,
  },

  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#18181b',
  },

  productQty: {
    marginTop: 4,
    fontSize: 12,
    color: '#71717a',
  },

  productPrice: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '700',
    color: PRIMARY,
  },

  paymentText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#18181b',
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  totalLabel: {
    color: '#71717a',
  },

  totalPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#18181b',
  },

  checkoutBtn: {
    backgroundColor: PRIMARY,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },

  checkoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  disabledCard: {
    opacity: 0.5,
    backgroundColor: '#f4f4f5',
  },

  disabledText: {
    color: '#a1a1aa',
  },

  disabledRadioCircle: {
    borderColor: '#d4d4d8',
  },
});
