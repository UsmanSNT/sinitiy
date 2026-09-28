import type { ImageSourcePropType } from "react-native";
import type { NavigatorScreenParams } from "@react-navigation/native";
import type { AdRequest } from "@sinity/shared";

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Signup: undefined;
  Main: NavigatorScreenParams<MainTabParamList> | undefined;
  PostDetail: { postId: string };
  NewPost: undefined;
  JobWelfare: undefined;
  JobDetail: {
    title: string;
    organization: string;
    period: string;
    category?: string;
    image: ImageSourcePropType;
    content?: string;
    phone?: string;
    targetAudience?: string;
    applyMethod?: string;
    // Qaysi pastki menyu bo'limidan ochilgani (footer'da o'sha tab yonadi); berilmasa 서비스.
    from?: keyof MainTabParamList;
  };
  HealthMedical: undefined;
  HealthDetail: {
    title: string;
    organization: string;
    period: string;
    category: string;
    image: ImageSourcePropType;
    content?: string;
    phone?: string;
    targetAudience?: string;
    applyMethod?: string;
    // Qaysi pastki menyu bo'limidan ochilgani (footer'da o'sha tab yonadi); berilmasa 서비스.
    from?: keyof MainTabParamList;
  };
  EducationCulture: undefined;
  EducationDetail: {
    title: string;
    organization: string;
    period: string;
    category: string;
    image: ImageSourcePropType;
    content?: string;
    phone?: string;
    targetAudience?: string;
    applyMethod?: string;
    // Qaysi pastki menyu bo'limidan ochilgani (footer'da o'sha tab yonadi); berilmasa 서비스.
    from?: keyof MainTabParamList;
  };
  LifeConvenience: undefined;
  LifeConvenienceDetail: {
    title: string;
    organization: string;
    period: string;
    category: string;
    image: ImageSourcePropType;
    content?: string;
    phone?: string;
    targetAudience?: string;
    applyMethod?: string;
    // Qaysi pastki menyu bo'limidan ochilgani (footer'da o'sha tab yonadi); berilmasa 서비스.
    from?: keyof MainTabParamList;
  };
  Notifications: undefined;
  MyListings: undefined;
  ListingForm: undefined;
  AdminListings: undefined;
  AdminReports: undefined;
  AdminPosts: undefined;
  AdminUsers: undefined;
  AdminAds: undefined;
  MyAds: undefined;
  AdForm: undefined;
  AdDetail: { ad: AdRequest; color: string };
  PartnerInfo: undefined;
  PartnerDetail: {
    title: string;
    service: string;
    category: string;
    image: ImageSourcePropType;
    location: string | null;
    address: string;
    phone: string;
    homepage: string | null;
    description: string | null;
  };
  InterestSettings: undefined;
  NotificationSettings: undefined;
  CustomerCenter: undefined;
  MyActivity: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Services: undefined;
  Community: undefined;
  MyPage: undefined;
};
