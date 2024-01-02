interface ISidebarItem {
  icon?: string;
  name : string;
  updateState () : void;
}

export default function SidebarItem({ name, updateState } : ISidebarItem) {
  return (
    <li className="flex" onClick={updateState}>
      <div>{ name }</div>
    </li>
  );
}