import type { ImageSourcePropType } from "react-native";
import type { NavigatorScreenParams } from "@react-navigation/native";
import type { AdRequest, Listing, PartnerCompany, Post } from "@sinity/shared";
import type { SupportDocKind } from "../lib/supportDocs";

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Signup: undefined;
  Main: NavigatorScreenParams<MainTabParamList> | undefined;
  PostDetail: { postId: string };
  // post berilsa - tahrirlash rejimi.
  NewPost: { post?: Post } | undefined;
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
    applyUrl?: string;
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
    applyUrl?: string;
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
    applyUrl?: string;
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
    applyUrl?: string;
    // Qaysi pastki menyu bo'limidan ochilgani (footer'da o'sha tab yonadi); berilmasa 서비스.
    from?: keyof MainTabParamList;
  };
  Notifications: undefined;
  MyListings: undefined;
  // listing berilsa - tahrirlash rejimi (tashkilot o'z e'lonini tahrirlaydi).
  ListingForm: { listing?: Listing } | undefined;
  AdminListings: undefined;
  AdminReports: undefined;
  AdminPosts: undefined;
  AdminUsers: undefined;
  AdminAds: undefined;
  AdminStats: undefined;
  MyAds: undefined;
  AdForm: { ad?: AdRequest } | undefined;
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
  SupportDoc: { kind: SupportDocKind };
  Inquiry: undefined;
  AdminInquiries: undefined;
  AdminPartners: undefined;
  PartnerForm: { partner?: PartnerCompany } | undefined;
  AdminNotices: undefined;
  MyActivity: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Services: undefined;
  Community: undefined;
  MyPage: undefined;
};
