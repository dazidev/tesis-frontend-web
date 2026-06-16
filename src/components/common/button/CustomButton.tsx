interface Props {
  // id: string;
  label: string;
}

export const CustomButton = ({ label }: Props) => {
  return (
    <button className="w-full h-11 bg-pblue rounded-lg hover:bg-pbutton mt-5 focus:scale-102 cursor-pointer">
      <span className="text-white">{label}</span>
    </button>
  );
};
