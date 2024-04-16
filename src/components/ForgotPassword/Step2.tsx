import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { Button, Container, Heading, Stack, Text } from "@chakra-ui/react";
import CustomFormControl from "../AuthPages/CustomFormControl";

export interface Step2Value {
  token: string;
}

export interface Step2Props {
  increaseStep: (step: number) => void;
  setToken: (token: string) => void;
  email: string;
}

export const Step2Schema = yup
  .object({
    token: yup.string().required("Token is required."),
  })
  .required();

export const Step2: React.FC<Step2Props> = ({ increaseStep, setToken, email }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<Step2Value>({ resolver: yupResolver(Step2Schema) });

  const onSubmit = async (data: Step2Value) => {
    increaseStep(2);
    setToken(data.token);
  };

  return (
    <Stack gap={5}>
      <Heading size="2xl" color="blue.500">
        Enter Token
      </Heading>
      <Text size="lg" fontWeight={300}>
        We have sent a token to <strong>{email}</strong>
      </Text>
      <Stack gap={1}>
        <CustomFormControl
          errors={errors}
          name="token"
          label="Emailed token"
          placeholder=""
          register={register}
        />
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Container paddingTop={100}>
          <Button w="100%" type="submit">
            Next
          </Button>
        </Container>
      </form>
    </Stack>
  );
};
