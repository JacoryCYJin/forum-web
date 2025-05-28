/**
 * @file 用户协议弹窗组件
 * @description 显示用户服务条款和隐私政策的弹窗组件，支持动画效果
 */

"use client";

import React, { useEffect, useState } from "react";

/**
 * 协议弹窗组件Props
 */
interface TermsDialogProps {
  /**
   * 弹窗是否可见
   */
  visible: boolean;

  /**
   * 关闭弹窗的回调函数
   */
  onClose: () => void;

  /**
   * 同意协议的回调函数
   */
  onAgree: () => void;
}

/**
 * 用户协议弹窗组件
 *
 * 显示用户服务条款和隐私政策，用户阅读后可以选择同意
 * 支持进入和退出动画效果，弹窗不受父容器限制
 *
 * @component
 * @example
 * <TermsDialog
 *   visible={showTerms}
 *   onClose={() => setShowTerms(false)}
 *   onAgree={() => {
 *     setShowTerms(false);
 *     setAgreeTerms(true);
 *   }}
 * />
 */
const TermsDialog: React.FC<TermsDialogProps> = ({
  visible,
  onClose,
  onAgree,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(visible);

  /**
   * 监听可见性变化，控制动画状态
   */
  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      // 延迟一帧启动进入动画
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    } else {
      setIsAnimating(false);
      // 等待退出动画完成后移除DOM元素
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300); // 匹配CSS动画时长

      return () => clearTimeout(timer);
    }
  }, [visible]);

  /**
   * 处理ESC键关闭
   */
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && visible) {
        onClose();
      }
    };

    if (shouldRender) {
      document.addEventListener("keydown", handleEscKey);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
      document.body.style.overflow = "";
    };
  }, [shouldRender, visible, onClose]);

  /**
   * 处理同意协议
   */
  const handleAgree = () => {
    onAgree();
  };

  /**
   * 处理背景点击关闭
   */
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-300 ease-out ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
      style={{ pointerEvents: isAnimating ? "auto" : "none" }}
    >
      {/* 背景遮罩 */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ease-out ${
          isAnimating ? "bg-opacity-60" : "bg-opacity-0"
        }`}
        onClick={handleBackdropClick}
      />

      {/* 弹窗主体 */}
      <div
        className={`bg-white dark:bg-neutral-800 shadow-2xl relative z-10 overflow-hidden max-w-2xl w-full mx-4 rounded-2xl transform transition-all duration-300 ease-out ${
          isAnimating
            ? "scale-100 translate-y-0 opacity-100"
            : "scale-95 translate-y-8 opacity-0"
        }`}
        style={{ maxHeight: "85vh" }}
      >
        {/* 弹窗头部 */}
        <div className="flex items-center justify-between p-3 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
          <h2 className="text-xl font-semibold text-neutral-800 dark:text-white">
            用户协议与隐私政策
          </h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors duration-200 p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700"
            aria-label="关闭协议弹窗"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* 协议内容 */}
        <div
          className="p-6 overflow-y-auto"
          style={{ maxHeight: "calc(85vh - 140px)" }}
        >
          <div className="space-y-6 text-neutral-700 dark:text-neutral-300">
            {/* 服务条款 */}
            <section>
              <h3 className="text-lg font-semibold text-neutral-800 dark:text-white mb-3">
                服务条款
              </h3>
              <div className="space-y-3 text-sm leading-relaxed">
                <p>
                  欢迎使用我们的论坛服务。在您注册和使用我们的服务之前，请仔细阅读并理解以下条款和条件。
                </p>
                <p>
                  <strong>1. 接受条款：</strong>
                  通过注册账户或使用我们的服务，您表示同意遵守这些服务条款。如果您不同意这些条款，请不要使用我们的服务。
                </p>
                <p>
                  <strong>2. 用户责任：</strong>
                  您有责任确保您发布的内容不违反法律法规，不侵犯他人权益，不包含有害、诽谤、骚扰或不当的内容。
                </p>
                <p>
                  <strong>3. 账户安全：</strong>
                  您有责任保护您的账户信息和密码的安全。您同意不与他人共享您的登录凭据。
                </p>
                <p>
                  <strong>4. 内容所有权：</strong>
                  您保留对您发布内容的所有权，但授予我们使用、展示和分发这些内容的权利。
                </p>
                <p>
                  <strong>5. 服务变更：</strong>
                  我们保留随时修改、暂停或终止服务的权利，无需事先通知。
                </p>
              </div>
            </section>

            {/* 隐私政策 */}
            <section>
              <h3 className="text-lg font-semibold text-neutral-800 dark:text-white mb-3">
                隐私政策
              </h3>
              <div className="space-y-3 text-sm leading-relaxed">
                <p>
                  我们重视您的隐私，本政策说明我们如何收集、使用和保护您的个人信息。
                </p>
                <p>
                  <strong>1. 信息收集：</strong>
                  我们收集您提供的注册信息（如用户名、邮箱、手机号）以及您在使用服务时产生的数据。
                </p>
                <p>
                  <strong>2. 信息使用：</strong>
                  我们使用您的信息来提供服务、改善用户体验、发送重要通知和进行安全验证。
                </p>
                <p>
                  <strong>3. 信息分享：</strong>
                  除法律要求外，我们不会与第三方分享您的个人信息。我们可能与服务提供商共享必要信息以维护服务运行。
                </p>
                <p>
                  <strong>4. 数据安全：</strong>
                  我们采用行业标准的安全措施来保护您的个人信息，包括加密存储和传输。
                </p>
                <p>
                  <strong>5. Cookie使用：</strong>
                  我们使用Cookie和类似技术来改善您的浏览体验和分析网站使用情况。
                </p>
                <p>
                  <strong>6. 权利控制：</strong>
                  您有权访问、更正、删除您的个人信息，或限制我们对您信息的处理。
                </p>
              </div>
            </section>

            {/* 联系信息 */}
            <section>
              <h3 className="text-lg font-semibold text-neutral-800 dark:text-white mb-3">
                联系我们
              </h3>
              <div className="space-y-2 text-sm">
                <p>如果您对本协议有任何疑问，请通过以下方式联系我们：</p>
                <p>邮箱：team.openshare@outlook.com</p>
                <p>电话：138-1662-1010</p>
                <p>地址：上海电力大学</p>
              </div>
            </section>

            <div className="text-xs text-neutral-500 dark:text-neutral-400 pt-4 border-t border-neutral-200 dark:border-neutral-700">
              最后更新时间：2025年5月28日
            </div>
          </div>
        </div>

        {/* 弹窗底部 */}
        <div className="flex items-center justify-end space-x-4 p-3 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-neutral-200 dark:bg-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-500 transition-colors duration-200              transform hover:scale-[1.02]
            font-medium shadow-sm hover:shadow-md"
          >
            稍后阅读
          </button>
          <button
            onClick={handleAgree}
            className="px-6 py-2 bg-primary text-white rounded-lg 
             transition-all duration-200 ease-in-out 
             font-medium shadow-lg 
             hover:bg-primary-hover hover:shadow-xl 
             transform hover:scale-[1.02]
             hover:shadow-md"
          >
            我已阅读并同意
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsDialog;
