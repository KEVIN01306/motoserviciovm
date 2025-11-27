import { create } from 'zustand';

type ShoppingCartState = {
  shoppingCardtList: Array<any>;
  addShoppingCart: (item: any) => void;
  deleteShoppingCart: (id: string) => void;
  clearShoppingCart: () => void;
};

export const useShoppingCart = create<ShoppingCartState>((set, get) => ({
  shoppingCardtList: [],
  addShoppingCart: (item) => set((s) => ({ shoppingCardtList: [...s.shoppingCardtList, item] })),
  deleteShoppingCart: (id) => set((s) => ({ shoppingCardtList: s.shoppingCardtList.filter((i: any) => i._id !== id) })),
  clearShoppingCart: () => set({ shoppingCardtList: [] }),
}));

export default useShoppingCart;
