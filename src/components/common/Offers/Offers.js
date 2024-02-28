import { useRef } from "react";
import React, { useState } from "react";
import useStyles from "./styles";
import OfferCard from "./OfferCard";
import { Grid, IconButton, Typography } from "@mui/material";
import { ReactComponent as PreviousIcon } from "../../../assets/images/previous.svg";
import { ReactComponent as NextIcon } from "../../../assets/images/next.svg";

const offers = [
  {
    title: "Pizza Hut",
    offerText: "flat 10% off",
    link: "",
    //  brandImage: "https://www.pizzahut.co.in/order/images/logos/logo_wide@x2.38f9109e24d22d58d048837b27f54390.png",
    brandImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Baskin-Robbins_logo_2022.svg/1600px-Baskin-Robbins_logo_2022.svg.png",
  },
  {
    title: "H&M",
    offerText: "flat 10% off",
    link: "",
    brandImage:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAMAAACfWMssAAAAdVBMVEX////NICbKAADNHSPHAADMFx799/f+/PzMExvmo6TceHrLAAnLDhfOJiv129z89PTrt7jqsrPLBBHUTlHwycrRPEDabnHXXmHyz9Dtvb7YZWjora777/D56Oj34eLoqarkmZregoTgi4zVVFjjkpTQMzfSRUkBFS+6AAACTUlEQVRIie1U7bKrIAwkAeoXaouftWprbfv+j3gT8HTOmcrMfYDmBzCRlc1mQYhvfOMb/xv97KYxqaKfVHmZt9V5qEO4WSU8pSqTW6ZoEW9udUTESwiY4kjjhGAfW8YYsG57iRJwDuAOOPB0N4DTxg4BsrNLWpAmdOBV9TRGRup1ywwxABb8zwxAdyHgM+fxlAGefygAAZn+zQLYWwBXeGleWupN02PGQMdC0yIkqpemQDDLlumIqWy4CFwlqHIft0mTxm/1SqyoMs7qpZIyDxx4UUyFVHhLc8TEgrmTuKo3ELcBYOOafslAru3gmZo6c21sOirAJvu4Qj2Ka9pQVSCx89xbApIkveovFrDfLbDutEYbS8KB9aTO6sz7ZzE8XeWHD9R0WxE1bCGx8d1oUTzIRIdRnagO+fw87q48SmqaZX702Sjr6CAJ4oEiwn1tanKwtmjWQTt/uGpqdRGdpjZmdxHUpm7i9VT4Jk6iAlZ1IT+8yLa1mpwNd7URiXJWRtCVEPbOqsqXELnU7dD5C/OpDcfTlU7ezE5CrNnI7SHOUsqGLVrpPW3E29+d5h8f1RJF4kYcIkOWY6fZkG8Wxf4unXaTeuTUvBeQsCQqi8VvwnUXiOvGlHhd8WFTMSJfEZDuMagxoE2tXO+GWMbUC6XylPiy5Qfjrj15fV+b1qfpJqZcMLmTLifbp8zdY0A+2NUmQlf5H0LbAzO7K/PS+9r07pESMzJTH6U6/tqw4L5vosLPBS7vXPFnR6KCj7gnNoa+1FHoyze+8Y3f8Q+bxB4od6UNJQAAAABJRU5ErkJggg==",
  },
  {
    title: "Baskin Robbins",
    offerText: "50% off",
    link: "",
    brandImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Baskin-Robbins_logo_2022.svg/1600px-Baskin-Robbins_logo_2022.svg.png",
  },
  {
    title: "Pizza Hut",
    offerText: "flat 10% off",
    link: "",
    //  brandImage: "https://www.pizzahut.co.in/order/images/logos/logo_wide@x2.38f9109e24d22d58d048837b27f54390.png",
    brandImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Baskin-Robbins_logo_2022.svg/1600px-Baskin-Robbins_logo_2022.svg.png",
  },
  {
    title: "H&M",
    offerText: "flat 10% off",
    link: "",
    brandImage:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAMAAACfWMssAAAAdVBMVEX////NICbKAADNHSPHAADMFx799/f+/PzMExvmo6TceHrLAAnLDhfOJiv129z89PTrt7jqsrPLBBHUTlHwycrRPEDabnHXXmHyz9Dtvb7YZWjora777/D56Oj34eLoqarkmZregoTgi4zVVFjjkpTQMzfSRUkBFS+6AAACTUlEQVRIie1U7bKrIAwkAeoXaouftWprbfv+j3gT8HTOmcrMfYDmBzCRlc1mQYhvfOMb/xv97KYxqaKfVHmZt9V5qEO4WSU8pSqTW6ZoEW9udUTESwiY4kjjhGAfW8YYsG57iRJwDuAOOPB0N4DTxg4BsrNLWpAmdOBV9TRGRup1ywwxABb8zwxAdyHgM+fxlAGefygAAZn+zQLYWwBXeGleWupN02PGQMdC0yIkqpemQDDLlumIqWy4CFwlqHIft0mTxm/1SqyoMs7qpZIyDxx4UUyFVHhLc8TEgrmTuKo3ELcBYOOafslAru3gmZo6c21sOirAJvu4Qj2Ka9pQVSCx89xbApIkveovFrDfLbDutEYbS8KB9aTO6sz7ZzE8XeWHD9R0WxE1bCGx8d1oUTzIRIdRnagO+fw87q48SmqaZX702Sjr6CAJ4oEiwn1tanKwtmjWQTt/uGpqdRGdpjZmdxHUpm7i9VT4Jk6iAlZ1IT+8yLa1mpwNd7URiXJWRtCVEPbOqsqXELnU7dD5C/OpDcfTlU7ezE5CrNnI7SHOUsqGLVrpPW3E29+d5h8f1RJF4kYcIkOWY6fZkG8Wxf4unXaTeuTUvBeQsCQqi8VvwnUXiOvGlHhd8WFTMSJfEZDuMagxoE2tXO+GWMbUC6XylPiy5Qfjrj15fV+b1qfpJqZcMLmTLifbp8zdY0A+2NUmQlf5H0LbAzO7K/PS+9r07pESMzJTH6U6/tqw4L5vosLPBS7vXPFnR6KCj7gnNoa+1FHoyze+8Y3f8Q+bxB4od6UNJQAAAABJRU5ErkJggg==",
  },
  {
    title: "Baskin Robbins",
    offerText: "50% off",
    link: "",
    brandImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Baskin-Robbins_logo_2022.svg/1600px-Baskin-Robbins_logo_2022.svg.png",
  },
  {
    title: "Pizza Hut",
    offerText: "flat 10% off",
    link: "",
    //  brandImage: "https://www.pizzahut.co.in/order/images/logos/logo_wide@x2.38f9109e24d22d58d048837b27f54390.png",
    brandImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Baskin-Robbins_logo_2022.svg/1600px-Baskin-Robbins_logo_2022.svg.png",
  },
  {
    title: "H&M",
    offerText: "flat 10% off",
    link: "",
    brandImage:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAMAAACfWMssAAAAdVBMVEX////NICbKAADNHSPHAADMFx799/f+/PzMExvmo6TceHrLAAnLDhfOJiv129z89PTrt7jqsrPLBBHUTlHwycrRPEDabnHXXmHyz9Dtvb7YZWjora777/D56Oj34eLoqarkmZregoTgi4zVVFjjkpTQMzfSRUkBFS+6AAACTUlEQVRIie1U7bKrIAwkAeoXaouftWprbfv+j3gT8HTOmcrMfYDmBzCRlc1mQYhvfOMb/xv97KYxqaKfVHmZt9V5qEO4WSU8pSqTW6ZoEW9udUTESwiY4kjjhGAfW8YYsG57iRJwDuAOOPB0N4DTxg4BsrNLWpAmdOBV9TRGRup1ywwxABb8zwxAdyHgM+fxlAGefygAAZn+zQLYWwBXeGleWupN02PGQMdC0yIkqpemQDDLlumIqWy4CFwlqHIft0mTxm/1SqyoMs7qpZIyDxx4UUyFVHhLc8TEgrmTuKo3ELcBYOOafslAru3gmZo6c21sOirAJvu4Qj2Ka9pQVSCx89xbApIkveovFrDfLbDutEYbS8KB9aTO6sz7ZzE8XeWHD9R0WxE1bCGx8d1oUTzIRIdRnagO+fw87q48SmqaZX702Sjr6CAJ4oEiwn1tanKwtmjWQTt/uGpqdRGdpjZmdxHUpm7i9VT4Jk6iAlZ1IT+8yLa1mpwNd7URiXJWRtCVEPbOqsqXELnU7dD5C/OpDcfTlU7ezE5CrNnI7SHOUsqGLVrpPW3E29+d5h8f1RJF4kYcIkOWY6fZkG8Wxf4unXaTeuTUvBeQsCQqi8VvwnUXiOvGlHhd8WFTMSJfEZDuMagxoE2tXO+GWMbUC6XylPiy5Qfjrj15fV+b1qfpJqZcMLmTLifbp8zdY0A+2NUmQlf5H0LbAzO7K/PS+9r07pESMzJTH6U6/tqw4L5vosLPBS7vXPFnR6KCj7gnNoa+1FHoyze+8Y3f8Q+bxB4od6UNJQAAAABJRU5ErkJggg==",
  },
  {
    title: "Baskin Robbins",
    offerText: "50% off",
    link: "",
    brandImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Baskin-Robbins_logo_2022.svg/1600px-Baskin-Robbins_logo_2022.svg.png",
  },
  {
    title: "Pizza Hut",
    offerText: "flat 10% off",
    link: "",
    //  brandImage: "https://www.pizzahut.co.in/order/images/logos/logo_wide@x2.38f9109e24d22d58d048837b27f54390.png",
    brandImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Baskin-Robbins_logo_2022.svg/1600px-Baskin-Robbins_logo_2022.svg.png",
  },
  {
    title: "H&M",
    offerText: "flat 10% off",
    link: "",
    brandImage:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAMAAACfWMssAAAAdVBMVEX////NICbKAADNHSPHAADMFx799/f+/PzMExvmo6TceHrLAAnLDhfOJiv129z89PTrt7jqsrPLBBHUTlHwycrRPEDabnHXXmHyz9Dtvb7YZWjora777/D56Oj34eLoqarkmZregoTgi4zVVFjjkpTQMzfSRUkBFS+6AAACTUlEQVRIie1U7bKrIAwkAeoXaouftWprbfv+j3gT8HTOmcrMfYDmBzCRlc1mQYhvfOMb/xv97KYxqaKfVHmZt9V5qEO4WSU8pSqTW6ZoEW9udUTESwiY4kjjhGAfW8YYsG57iRJwDuAOOPB0N4DTxg4BsrNLWpAmdOBV9TRGRup1ywwxABb8zwxAdyHgM+fxlAGefygAAZn+zQLYWwBXeGleWupN02PGQMdC0yIkqpemQDDLlumIqWy4CFwlqHIft0mTxm/1SqyoMs7qpZIyDxx4UUyFVHhLc8TEgrmTuKo3ELcBYOOafslAru3gmZo6c21sOirAJvu4Qj2Ka9pQVSCx89xbApIkveovFrDfLbDutEYbS8KB9aTO6sz7ZzE8XeWHD9R0WxE1bCGx8d1oUTzIRIdRnagO+fw87q48SmqaZX702Sjr6CAJ4oEiwn1tanKwtmjWQTt/uGpqdRGdpjZmdxHUpm7i9VT4Jk6iAlZ1IT+8yLa1mpwNd7URiXJWRtCVEPbOqsqXELnU7dD5C/OpDcfTlU7ezE5CrNnI7SHOUsqGLVrpPW3E29+d5h8f1RJF4kYcIkOWY6fZkG8Wxf4unXaTeuTUvBeQsCQqi8VvwnUXiOvGlHhd8WFTMSJfEZDuMagxoE2tXO+GWMbUC6XylPiy5Qfjrj15fV+b1qfpJqZcMLmTLifbp8zdY0A+2NUmQlf5H0LbAzO7K/PS+9r07pESMzJTH6U6/tqw4L5vosLPBS7vXPFnR6KCj7gnNoa+1FHoyze+8Y3f8Q+bxB4od6UNJQAAAABJRU5ErkJggg==",
  },
  {
    title: "Baskin Robbins",
    offerText: "50% off",
    link: "",
    brandImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Baskin-Robbins_logo_2022.svg/1600px-Baskin-Robbins_logo_2022.svg.png",
  },
  {
    title: "Pizza Hut",
    offerText: "flat 10% off",
    link: "",
    //  brandImage: "https://www.pizzahut.co.in/order/images/logos/logo_wide@x2.38f9109e24d22d58d048837b27f54390.png",
    brandImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Baskin-Robbins_logo_2022.svg/1600px-Baskin-Robbins_logo_2022.svg.png",
  },
  {
    title: "H&M",
    offerText: "flat 10% off",
    link: "",
    brandImage:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAMAAACfWMssAAAAdVBMVEX////NICbKAADNHSPHAADMFx799/f+/PzMExvmo6TceHrLAAnLDhfOJiv129z89PTrt7jqsrPLBBHUTlHwycrRPEDabnHXXmHyz9Dtvb7YZWjora777/D56Oj34eLoqarkmZregoTgi4zVVFjjkpTQMzfSRUkBFS+6AAACTUlEQVRIie1U7bKrIAwkAeoXaouftWprbfv+j3gT8HTOmcrMfYDmBzCRlc1mQYhvfOMb/xv97KYxqaKfVHmZt9V5qEO4WSU8pSqTW6ZoEW9udUTESwiY4kjjhGAfW8YYsG57iRJwDuAOOPB0N4DTxg4BsrNLWpAmdOBV9TRGRup1ywwxABb8zwxAdyHgM+fxlAGefygAAZn+zQLYWwBXeGleWupN02PGQMdC0yIkqpemQDDLlumIqWy4CFwlqHIft0mTxm/1SqyoMs7qpZIyDxx4UUyFVHhLc8TEgrmTuKo3ELcBYOOafslAru3gmZo6c21sOirAJvu4Qj2Ka9pQVSCx89xbApIkveovFrDfLbDutEYbS8KB9aTO6sz7ZzE8XeWHD9R0WxE1bCGx8d1oUTzIRIdRnagO+fw87q48SmqaZX702Sjr6CAJ4oEiwn1tanKwtmjWQTt/uGpqdRGdpjZmdxHUpm7i9VT4Jk6iAlZ1IT+8yLa1mpwNd7URiXJWRtCVEPbOqsqXELnU7dD5C/OpDcfTlU7ezE5CrNnI7SHOUsqGLVrpPW3E29+d5h8f1RJF4kYcIkOWY6fZkG8Wxf4unXaTeuTUvBeQsCQqi8VvwnUXiOvGlHhd8WFTMSJfEZDuMagxoE2tXO+GWMbUC6XylPiy5Qfjrj15fV+b1qfpJqZcMLmTLifbp8zdY0A+2NUmQlf5H0LbAzO7K/PS+9r07pESMzJTH6U6/tqw4L5vosLPBS7vXPFnR6KCj7gnNoa+1FHoyze+8Y3f8Q+bxB4od6UNJQAAAABJRU5ErkJggg==",
  },
  {
    title: "Baskin Robbins",
    offerText: "50% off",
    link: "",
    brandImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Baskin-Robbins_logo_2022.svg/1600px-Baskin-Robbins_logo_2022.svg.png",
  },
  {
    title: "Pizza Hut",
    offerText: "flat 10% off",
    link: "",
    //  brandImage: "https://www.pizzahut.co.in/order/images/logos/logo_wide@x2.38f9109e24d22d58d048837b27f54390.png",
    brandImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Baskin-Robbins_logo_2022.svg/1600px-Baskin-Robbins_logo_2022.svg.png",
  },
  {
    title: "H&M",
    offerText: "flat 10% off",
    link: "",
    brandImage:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAMAAACfWMssAAAAdVBMVEX////NICbKAADNHSPHAADMFx799/f+/PzMExvmo6TceHrLAAnLDhfOJiv129z89PTrt7jqsrPLBBHUTlHwycrRPEDabnHXXmHyz9Dtvb7YZWjora777/D56Oj34eLoqarkmZregoTgi4zVVFjjkpTQMzfSRUkBFS+6AAACTUlEQVRIie1U7bKrIAwkAeoXaouftWprbfv+j3gT8HTOmcrMfYDmBzCRlc1mQYhvfOMb/xv97KYxqaKfVHmZt9V5qEO4WSU8pSqTW6ZoEW9udUTESwiY4kjjhGAfW8YYsG57iRJwDuAOOPB0N4DTxg4BsrNLWpAmdOBV9TRGRup1ywwxABb8zwxAdyHgM+fxlAGefygAAZn+zQLYWwBXeGleWupN02PGQMdC0yIkqpemQDDLlumIqWy4CFwlqHIft0mTxm/1SqyoMs7qpZIyDxx4UUyFVHhLc8TEgrmTuKo3ELcBYOOafslAru3gmZo6c21sOirAJvu4Qj2Ka9pQVSCx89xbApIkveovFrDfLbDutEYbS8KB9aTO6sz7ZzE8XeWHD9R0WxE1bCGx8d1oUTzIRIdRnagO+fw87q48SmqaZX702Sjr6CAJ4oEiwn1tanKwtmjWQTt/uGpqdRGdpjZmdxHUpm7i9VT4Jk6iAlZ1IT+8yLa1mpwNd7URiXJWRtCVEPbOqsqXELnU7dD5C/OpDcfTlU7ezE5CrNnI7SHOUsqGLVrpPW3E29+d5h8f1RJF4kYcIkOWY6fZkG8Wxf4unXaTeuTUvBeQsCQqi8VvwnUXiOvGlHhd8WFTMSJfEZDuMagxoE2tXO+GWMbUC6XylPiy5Qfjrj15fV+b1qfpJqZcMLmTLifbp8zdY0A+2NUmQlf5H0LbAzO7K/PS+9r07pESMzJTH6U6/tqw4L5vosLPBS7vXPFnR6KCj7gnNoa+1FHoyze+8Y3f8Q+bxB4od6UNJQAAAABJRU5ErkJggg==",
  },
  {
    title: "Baskin Robbins",
    offerText: "50% off",
    link: "",
    brandImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Baskin-Robbins_logo_2022.svg/1600px-Baskin-Robbins_logo_2022.svg.png",
  },
  {
    title: "Pizza Hut",
    offerText: "flat 10% off",
    link: "",
    //  brandImage: "https://www.pizzahut.co.in/order/images/logos/logo_wide@x2.38f9109e24d22d58d048837b27f54390.png",
    brandImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Baskin-Robbins_logo_2022.svg/1600px-Baskin-Robbins_logo_2022.svg.png",
  },
  {
    title: "H&M",
    offerText: "flat 10% off",
    link: "",
    brandImage:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAMAAACfWMssAAAAdVBMVEX////NICbKAADNHSPHAADMFx799/f+/PzMExvmo6TceHrLAAnLDhfOJiv129z89PTrt7jqsrPLBBHUTlHwycrRPEDabnHXXmHyz9Dtvb7YZWjora777/D56Oj34eLoqarkmZregoTgi4zVVFjjkpTQMzfSRUkBFS+6AAACTUlEQVRIie1U7bKrIAwkAeoXaouftWprbfv+j3gT8HTOmcrMfYDmBzCRlc1mQYhvfOMb/xv97KYxqaKfVHmZt9V5qEO4WSU8pSqTW6ZoEW9udUTESwiY4kjjhGAfW8YYsG57iRJwDuAOOPB0N4DTxg4BsrNLWpAmdOBV9TRGRup1ywwxABb8zwxAdyHgM+fxlAGefygAAZn+zQLYWwBXeGleWupN02PGQMdC0yIkqpemQDDLlumIqWy4CFwlqHIft0mTxm/1SqyoMs7qpZIyDxx4UUyFVHhLc8TEgrmTuKo3ELcBYOOafslAru3gmZo6c21sOirAJvu4Qj2Ka9pQVSCx89xbApIkveovFrDfLbDutEYbS8KB9aTO6sz7ZzE8XeWHD9R0WxE1bCGx8d1oUTzIRIdRnagO+fw87q48SmqaZX702Sjr6CAJ4oEiwn1tanKwtmjWQTt/uGpqdRGdpjZmdxHUpm7i9VT4Jk6iAlZ1IT+8yLa1mpwNd7URiXJWRtCVEPbOqsqXELnU7dD5C/OpDcfTlU7ezE5CrNnI7SHOUsqGLVrpPW3E29+d5h8f1RJF4kYcIkOWY6fZkG8Wxf4unXaTeuTUvBeQsCQqi8VvwnUXiOvGlHhd8WFTMSJfEZDuMagxoE2tXO+GWMbUC6XylPiy5Qfjrj15fV+b1qfpJqZcMLmTLifbp8zdY0A+2NUmQlf5H0LbAzO7K/PS+9r07pESMzJTH6U6/tqw4L5vosLPBS7vXPFnR6KCj7gnNoa+1FHoyze+8Y3f8Q+bxB4od6UNJQAAAABJRU5ErkJggg==",
  },
  {
    title: "Baskin Robbins",
    offerText: "50% off",
    link: "",
    brandImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Baskin-Robbins_logo_2022.svg/1600px-Baskin-Robbins_logo_2022.svg.png",
  },
];

const Offers = () => {
  const ref = useRef(null);
  const classes = useStyles();

  const scroll = (scrollOffset) => {
    ref.current.scrollLeft += scrollOffset;
  };

  return (
    <>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <Typography variant="h4" style={{ marginTop: 20 }}>
          Offers
        </Typography>
      </Grid>

      <div className={classes.offersContainer}>
        <div className={classes.leftIcon}>
          <IconButton
            color="inherit"
            className={classes.actionButton}
            onClick={() => {
              scroll(-1000);
            }}
          >
            <PreviousIcon />
          </IconButton>
        </div>
        <div className={classes.rightIcon}>
          <IconButton
            color="inherit"
            className={classes.actionButton}
            onClick={() => {
              scroll(1000);
            }}
          >
            <NextIcon style={{ fontSize: 30 }} />
          </IconButton>
        </div>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className={classes.offersRow} ref={ref}>
          {offers.map((offer) => {
            return (
              <OfferCard
                title={offer.title}
                offerText={offer.offerText}
                link={offer.link}
                brandImage={offer.brandImage}
              />
            );
          })}
        </Grid>
      </div>
    </>
  );
};

export default Offers;
