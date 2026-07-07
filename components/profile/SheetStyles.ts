import { StyleSheet } from 'react-native';

export const sc = StyleSheet.create({
  wrap: { padding: 20, gap: 12 },

  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  field: { gap: 4 },
  fieldLabel: { fontSize: 14, color: '#9ca3af', fontWeight: '500' },
  input: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  primaryBtn: {
    backgroundColor: '#3c89e8',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryBtnText: { color: '#fff', fontWeight: '600', fontSize: 15 },

  rowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#eef2ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTitle: { fontSize: 15, fontWeight: '600', color: '#111827' },
  rowSub: { fontSize: 13, color: '#6b7280', marginTop: 2 },

  outlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: '#0040B1',
    borderRadius: 14,
    paddingVertical: 12,
    borderStyle: 'dashed',
  },
  outlineBtnText: { color: '#0040B1', fontWeight: '600', fontSize: 15 },

  badge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { fontSize: 12, fontWeight: '600' },
  amount: { fontSize: 14, fontWeight: '600', color: '#374151' },

  favImg: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },

  centerBlock: { alignItems: 'center', gap: 6, paddingVertical: 8 },
  centerTitle: { fontSize: 20, fontWeight: '700', color: '#111827' },
  centerSub: { fontSize: 14, color: '#6b7280', textAlign: 'center' },

  statRow: { flexDirection: 'row', gap: 10 },
  statBox: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  statNum: { fontSize: 18, fontWeight: '700', color: '#0040B1' },
  statLabel: { fontSize: 12, color: '#6b7280', marginTop: 2 },

  paragraph: { fontSize: 14, color: '#4b5563', lineHeight: 22 },
});
