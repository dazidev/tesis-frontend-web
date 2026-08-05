interface Props {
  id: string;
  fullname: string;
  email: string;
  role: string;
  setManagerUser: (id: string) => void;
  managerUserTarget: string;
}

export function SearchUserItem({
  id,
  fullname,
  email,
  role,
  setManagerUser,
  managerUserTarget,
}: Props) {
  return (
    <button
      type="button"
      onClick={() => setManagerUser(id)}
      className={`
        w-full flex flex-row justify-between p-3 border  mt-4 rounded-lg text-gray-900  transition cursor-pointer
        ${managerUserTarget === id ? "border-green-600 border-2 bg-green-100 " : "border-gray-500 hover:bg-gray-100"}
        `}
    >
      <div className="flex flex-col text-left">
        <span className="text-lg">{fullname}</span>
        <span className="text-sm">{email}</span>
        <span className="text-sm">{role}</span>
      </div>
    </button>
  );
}
