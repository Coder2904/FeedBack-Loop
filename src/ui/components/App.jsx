// To support: system="express" scale="medium" color="light"
// import these spectrum web components modules:
import "@spectrum-web-components/theme/express/scale-medium.js";
import "@spectrum-web-components/theme/express/theme-light.js";

// To learn more about using "swc-react" visit:
// https://opensource.adobe.com/spectrum-web-components/using-swc-react/
import { Button } from "@swc-react/button";
import { Theme } from "@swc-react/theme";
import React, { useState, useEffect } from "react";
import "./App.css";

const App = ({ addOnUISdk, sandboxProxy }) => {
  // Core state management
  const [projectData, setProjectData] = useState({
    title: "Brand Guidelines Template",
    id: "proj_123456",
    dimensions: "1080x1080",
    lastModified: new Date().toLocaleDateString(),
  });

  const [reviewLink, setReviewLink] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [feedbackList, setFeedbackList] = useState([
    {
      id: 1,
      type: "suggestion",
      priority: "high",
      message: "The logo seems too small in the header",
      reviewer: "Sarah Johnson",
      timestamp: "2 hours ago",
      status: "pending",
    },
    {
      id: 2,
      type: "compliment",
      priority: "low",
      message: "Love the color scheme! Very professional.",
      reviewer: "Mike Chen",
      timestamp: "3 hours ago",
      status: "acknowledged",
    },
    {
      id: 3,
      type: "bug",
      priority: "medium",
      message: "Text alignment issue in the footer section",
      reviewer: "Alex Rivera",
      timestamp: "5 hours ago",
      status: "pending",
    },
  ]);

  const [activeTab, setActiveTab] = useState("create");
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    allowAnonymous: true,
    requireLogin: false,
    deadline: "",
    emailNotifications: true,
  });

  // Initialize project data using correct Adobe Express API
  useEffect(() => {
    initializeProject();
  }, []);

  const initializeProject = async () => {
    try {
      // Use correct API pattern - get document info through sandbox proxy
      const docInfo = await sandboxProxy.getDocumentInfo();
      setProjectData((prev) => ({
        ...prev,
        title: docInfo.title || "Untitled Project",
        dimensions: `${docInfo.width}x${docInfo.height}`,
        id: docInfo.id,
      }));
    } catch (error) {
      console.error("Error initializing project:", error);
      // Keep default values if API fails
    }
  };

  // Core Feature: Generate Review Link
  const generateReviewLink = async () => {
    setIsGenerating(true);

    try {
      // Generate thumbnail through sandbox proxy (correct pattern)
      const thumbnailData = await sandboxProxy.generateThumbnail();

      // Simulate API call for demo
      setTimeout(() => {
        const generatedLink = `https://express.ly/review/${Math.random()
          .toString(36)
          .substr(2, 9)}`;
        setReviewLink(generatedLink);
        setIsGenerating(false);
      }, 2000);
    } catch (error) {
      console.error("Error generating link:", error);
      // Fallback for demo
      setTimeout(() => {
        const generatedLink = `https://express.ly/review/${Math.random()
          .toString(36)
          .substr(2, 9)}`;
        setReviewLink(generatedLink);
        setIsGenerating(false);
      }, 2000);
    }
  };

  // Copy to clipboard functionality
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  // Utility functions for feedback display
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "priority-high";
      case "medium":
        return "priority-medium";
      case "low":
        return "priority-low";
      default:
        return "priority-default";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "bug":
        return "⚠️";
      case "suggestion":
        return "💡";
      case "compliment":
        return "✅";
      default:
        return "💬";
    }
  };

  const markFeedbackResolved = (id) => {
    setFeedbackList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "resolved" } : item
      )
    );
  };

  // Apply feedback by calling sandbox proxy
  const applyFeedback = async (feedbackId) => {
    try {
      const feedback = feedbackList.find((f) => f.id === feedbackId);
      if (feedback) {
        // Use sandbox proxy to apply changes (correct pattern)
        const result = await sandboxProxy.applyFeedbackChanges([
          {
            type: feedback.type,
            message: feedback.message,
            priority: feedback.priority,
          },
        ]);

        if (result.success) {
          markFeedbackResolved(feedbackId);
        }
      }
    } catch (error) {
      console.error("Error applying feedback:", error);
      // Still mark as resolved for demo
      markFeedbackResolved(feedbackId);
    }
  };

  const pendingCount = feedbackList.filter(
    (item) => item.status === "pending"
  ).length;

  return (
    <Theme system="express" scale="medium" color="light">
      <div className="feedback-loop-container">
        {/* Header */}
        <div className="header">
          <div className="header-content">
            <div className="header-left">
              <span className="icon">🔗</span>
              <h1 className="title">Feedback Loop</h1>
            </div>
            <button
              className="settings-btn"
              onClick={() => setShowSettings(!showSettings)}
            >
              ⚙️
            </button>
          </div>
        </div>

        {/* Settings Modal */}
        {showSettings && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Review Settings</h3>
                <button
                  className="close-btn"
                  onClick={() => setShowSettings(false)}
                >
                  ✕
                </button>
              </div>

              <div className="settings-form">
                <div className="setting-item">
                  <label>Allow Anonymous Feedback</label>
                  <input
                    type="checkbox"
                    checked={settings.allowAnonymous}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        allowAnonymous: e.target.checked,
                      }))
                    }
                  />
                </div>

                <div className="setting-item">
                  <label>Require Login</label>
                  <input
                    type="checkbox"
                    checked={settings.requireLogin}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        requireLogin: e.target.checked,
                      }))
                    }
                  />
                </div>

                <div className="setting-item">
                  <label>Review Deadline</label>
                  <input
                    type="date"
                    value={settings.deadline}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        deadline: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="setting-item">
                  <label>Email Notifications</label>
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        emailNotifications: e.target.checked,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="modal-footer">
                <Button
                  variant="secondary"
                  onClick={() => setShowSettings(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() => setShowSettings(false)}
                >
                  Save Settings
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="tab-nav">
          <button
            className={`tab-btn ${activeTab === "create" ? "active" : ""}`}
            onClick={() => setActiveTab("create")}
          >
            <span className="tab-icon">➕</span>
            Create Link
          </button>
          <button
            className={`tab-btn ${activeTab === "feedback" ? "active" : ""}`}
            onClick={() => setActiveTab("feedback")}
          >
            <span className="tab-icon">🔔</span>
            Feedback
            {pendingCount > 0 && <span className="badge">{pendingCount}</span>}
          </button>
        </div>

        {/* Content Area */}
        <div className="content-area">
          {activeTab === "create" && (
            <div className="create-tab">
              {/* Project Info */}
              <div className="project-info">
                <h3>Current Project</h3>
                <div className="project-details">
                  <div className="detail-row">
                    <span className="label">Title:</span>
                    <span className="value">{projectData.title}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Dimensions:</span>
                    <span className="value">{projectData.dimensions}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Last Modified:</span>
                    <span className="value">{projectData.lastModified}</span>
                  </div>
                </div>
              </div>

              {/* Generate Link Button */}
              <Button
                size="l"
                variant="primary"
                onClick={generateReviewLink}
                disabled={isGenerating}
                className="generate-btn"
              >
                {isGenerating ? (
                  <span>
                    <span className="spinner"></span>
                    Generating...
                  </span>
                ) : (
                  <span>📤 Create Review Link</span>
                )}
              </Button>

              {/* Generated Link */}
              {reviewLink && (
                <div className="generated-link">
                  <h4>Review Link Generated! ✅</h4>
                  <div className="link-container">
                    <input
                      type="text"
                      value={reviewLink}
                      readOnly
                      className="link-input"
                    />
                    <button
                      className="copy-btn"
                      onClick={() => copyToClipboard(reviewLink)}
                    >
                      {linkCopied ? "✅" : "📋"}
                    </button>
                  </div>
                  <p className="link-description">
                    Share this link with your team to collect feedback!
                  </p>
                </div>
              )}

              {/* Quick Actions */}
              <div className="quick-actions">
                <h4>Quick Actions</h4>
                <div className="action-grid">
                  <button className="action-btn email">📧 Email Link</button>
                  <button className="action-btn slack">
                    💬 Share to Slack
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "feedback" && (
            <div className="feedback-tab">
              <div className="feedback-header">
                <h3>Feedback Inbox ({feedbackList.length})</h3>
                <div className="pending-indicator">
                  <span>{pendingCount} pending</span>
                  <div className="pulse-dot"></div>
                </div>
              </div>

              {feedbackList.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">💬</div>
                  <p>No feedback yet</p>
                  <p className="empty-subtitle">
                    Share your review link to start collecting feedback
                  </p>
                </div>
              ) : (
                <div className="feedback-list">
                  {feedbackList.map((feedback) => (
                    <div
                      key={feedback.id}
                      className={`feedback-item ${feedback.status}`}
                    >
                      <div className="feedback-header-row">
                        <div className="feedback-meta">
                          <span className="type-icon">
                            {getTypeIcon(feedback.type)}
                          </span>
                          <span
                            className={`priority-badge ${getPriorityColor(
                              feedback.priority
                            )}`}
                          >
                            {feedback.priority}
                          </span>
                        </div>
                        <div className="timestamp">
                          <span className="time-icon">🕒</span>
                          <span>{feedback.timestamp}</span>
                        </div>
                      </div>

                      <p className="feedback-message">{feedback.message}</p>

                      <div className="feedback-footer">
                        <span className="reviewer">by {feedback.reviewer}</span>
                        <div className="feedback-actions">
                          {feedback.status === "pending" && (
                            <>
                              <Button
                                size="s"
                                variant="secondary"
                                onClick={() =>
                                  markFeedbackResolved(feedback.id)
                                }
                              >
                                Mark Resolved
                              </Button>
                            </>
                          )}
                          <span className={`status-badge ${feedback.status}`}>
                            {feedback.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="footer">
          <span>Feedback Loop v1.0</span>
          <div className="connection-status">
            <div className="status-dot connected"></div>
            <span>Connected</span>
          </div>
        </div>
      </div>
    </Theme>
  );
};

export default App;
