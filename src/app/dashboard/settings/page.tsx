import { useToast } from "@chakra-ui/react";
import { getServerSession } from "next-auth";
import { authOptions } from "@src/authOptions";
import UserDataContainer from "@src/components/UserDataContainer";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "@saas-ui/react";
import { useRouter } from "next/navigation";

// const schema = yup
//   .object({
//     email: yup
//       .string()
//       .required("Email is required.")
//       .email("Please provide a valid email."),
//     password: yup.string().required("Password is required."),
//   })
//   .required();

export default async function DashboardSettingsPage() {
  const session = await getServerSession(authOptions);

  // const onSubmit = async (data: RegisterSubmitValues) => {
    
  // }
  // 
  return (
    <UserDataContainer session={session} />
  );
}
