import type { ImageSourcePropType } from "react-native";

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Signup: undefined;
  Main: undefined;
  PostDetail: { postId: string };
  NewPost: undefined;
  JobWelfare: undefined;
  JobDetail: { title: string; organization: string; period: string; image: ImageSourcePropType };
  HealthMedical: undefined;
  HealthDetail: {
    title: string;
    organization: string;
    period: string;
    category: string;
    image: ImageSourcePropType;
  };
};

export type MainTabParamList = {
  Home: undefined;
  Services: undefined;
  Community: undefined;
  MyPage: undefined;
};
