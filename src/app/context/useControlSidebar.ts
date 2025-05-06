import { create } from 'zustand';

type useControlSidebarProps = {
  isOpen: boolean,
  setIsOpen: () => void,
  isCollapse: boolean,
  setIsCollapse: () => void,
}

export const useControlSidebar = create<useControlSidebarProps>()(
  (set) => ({
    isOpen: false,
    setIsOpen: () => set((state) => ({isOpen: !state.isOpen})),
    isCollapse: false,
    setIsCollapse: () => set((state) => ({isCollapse: !state.isCollapse}))
  })
)