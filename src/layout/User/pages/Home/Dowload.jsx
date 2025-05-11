import React from "react";
import classNames from "classnames/bind";
import styles from "./download.module.scss";
import AnimateOnScroll from "@/components/AnimationScroll";
// Tạo instance của classnames với bind styles
const cx = classNames.bind(styles);

const Dowload = () => {
  return (

    <div className="my-12" >
      <h3 className="text-3xl font-bold uppercase text-secondaryText-tw text-center" >Tải ứng dụng Đặt khám nhanh</h3>
      <div className="flex gap-10 justify-center items-center my-10">
        <div className="">
          <img src="https://medpro.vn/_next/image?url=https%3A%2F%2Fbo-api.medpro.com.vn%2Fstatic%2Fimages%2Fmedpro%2Fweb%2Ficon_ios.svg&w=3840&q=75" />
        </div>
        <div className="">
          <img src="https://medpro.vn/_next/image?url=https%3A%2F%2Fbo-api.medpro.com.vn%2Fstatic%2Fimages%2Fmedpro%2Fweb%2Ficon_google_play.svg&w=1920&q=75" />
        </div>
      </div>
      <div className="hidden md:block">
        <div className={cx("dowload")}>
          <div className={cx("center")}>
            <img
              className={cx("circle")}
              src="https://medpro.vn/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fellipse.a457aed3.png&w=1920&q=75"
              alt=""
            />
            <AnimateOnScroll
              animationClass="animate"
              hiddenClass="default-hidden"
              threshold={0.2}
            >
              <img
                className={cx("cell-phone")}
                src="https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn.medpro.vn%2Fprod-partner%2F858c322c-7f26-48d3-a5df-e633e9a3592e-20240325-095443.png&w=1920&q=75"
                alt=""
              />
            </AnimateOnScroll>
            <div className={cx("item-center", "left", "item1")}>
              <div className={cx("text")}>
                <h3 className={cx("text-title", "item-title")}>
                  Lấy số nhanh khám nhanh trực tuyến
                </h3>
                <p>
                  Đăng ký khám / tái khám nhanh theo ngày <br /> Đăng ký khám theo
                  bác sĩ chuyên khoa <br /> Tái khám theo lịch bệnh
                </p>
              </div>
              <div className={cx("icon")}>
                <img
                  src="https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn-pkh.longvan.net%2Fprod-partner%2Fbae71420-d9ef-48b7-91a9-0151c50c73da-fcf47d13-a9c5-4be8-aa6c-4d4e9b162c19-icon_dang_ky.svg.svg&w=1920&q=75"
                  alt=""
                />
              </div>
            </div>
            <div className={cx("item-center", "left", "item2")}>
              <div className={cx("text")}>
                <h3 className={cx("text-title", "item-title")}>
                  Lấy số nhanh khám nhanh trực tuyến
                </h3>
                <p>
                  {" "}
                  Đăng ký khám theo bác sĩ chuyên khoa <br /> Tái khám theo lịch
                  bệnh
                </p>
              </div>
              <div className={cx("icon")}>
                <img
                  src="https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn-pkh.longvan.net%2Fprod-partner%2Fbae71420-d9ef-48b7-91a9-0151c50c73da-fcf47d13-a9c5-4be8-aa6c-4d4e9b162c19-icon_dang_ky.svg.svg&w=1920&q=75"
                  alt=""
                />
              </div>
            </div>
            <div className={cx("item-center", "left", "item3")}>
              <div className={cx("text")}>
                <h3 className={cx("text-title", "item-title")}>
                  Lấy số nhanh khám nhanh trực tuyến
                </h3>
                <p>
                  {" "}
                  Đăng ký khám theo bác sĩ chuyên khoa <br /> Tái khám theo lịch
                  bệnh
                </p>
              </div>
              <div className={cx("icon")}>
                <img
                  src="https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn-pkh.longvan.net%2Fprod-partner%2Fbae71420-d9ef-48b7-91a9-0151c50c73da-fcf47d13-a9c5-4be8-aa6c-4d4e9b162c19-icon_dang_ky.svg.svg&w=1920&q=75"
                  alt=""
                />
              </div>
            </div>
            <div className={cx("item-center", "right", "item4", "reverse")}>
              <div className={cx("text")}>
                <h3 className={cx("text-title", "item-title")}>
                  Lấy số nhanh khám nhanh trực tuyến
                </h3>
                <p>
                  Đăng ký khám / tái khám nhanh theo ngày Tái khám theo lịch bệnh
                </p>
              </div>
              <div className={cx("icon")}>
                <img
                  src="https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn-pkh.longvan.net%2Fprod-partner%2Fbae71420-d9ef-48b7-91a9-0151c50c73da-fcf47d13-a9c5-4be8-aa6c-4d4e9b162c19-icon_dang_ky.svg.svg&w=1920&q=75"
                  alt=""
                />
              </div>
            </div>
            <div className={cx("item-center", "right", "item5", "reverse")}>
              <div className={cx("text")}>
                <h3 className={cx("text-title", "item-title")}>
                  Lấy số nhanh khám nhanh trực tuyến
                </h3>
                <p>
                  Đăng ký khám / tái khám nhanh theo ngày <br /> Đăng ký khám theo
                  bác sĩ chuyên khoa <br /> Tái khám theo lịch bệnh
                </p>
              </div>
              <div className={cx("icon")}>
                <img
                  src="https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn-pkh.longvan.net%2Fprod-partner%2Fbae71420-d9ef-48b7-91a9-0151c50c73da-fcf47d13-a9c5-4be8-aa6c-4d4e9b162c19-icon_dang_ky.svg.svg&w=1920&q=75"
                  alt=""
                />
              </div>
            </div>
            <div className={cx("item-center", "right", "item6", "reverse")}>
              <div className={cx("text")}>
                <h3 className={cx("text-title", "item-title")}>
                  Lấy số nhanh khám nhanh trực tuyến
                </h3>
                <p>
                  {" "}
                  Đăng ký khám theo bác sĩ chuyên khoa <br /> Tái khám theo lịch
                  bệnh
                </p>
              </div>
              <div className={cx("icon")}>
                <img
                  src="https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn-pkh.longvan.net%2Fprod-partner%2Fbae71420-d9ef-48b7-91a9-0151c50c73da-fcf47d13-a9c5-4be8-aa6c-4d4e9b162c19-icon_dang_ky.svg.svg&w=1920&q=75"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dowload;
