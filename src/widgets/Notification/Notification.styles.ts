import styled from '@emotion/styled'

export const NotificationContainer = styled.div<{ isRead: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 18px 20px;
  border-radius: 16px;
  background-color: ${props => props.isRead ? '#f8f9fa' : '#ffffff'};
  box-shadow: ${props => props.isRead
  ? '0 2px 8px rgba(0, 0, 0, 0.04)'
  : '0 4px 16px rgba(0, 0, 0, 0.06), 0 1px 4px rgba(83, 78, 155, 0.1)'};
  margin-bottom: 16px;
  height: 100%;
  transition: all 0.2s ease;
  border: 1px solid ${props => props.isRead ? '#ecedef' : '#e9ecff'};
  position: relative;
  overflow: hidden;

  &:hover {
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(83, 78, 155, 0.15);
  }

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 4px;
    background: ${props => props.isRead
  ? '#d1d5db'
  : 'linear-gradient(to bottom, #6d62c9, #a181ef)'};
  }
`;

export const NotificationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
  gap: 12px;
`;

export const Title = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333344;
  display: flex;
  align-items: center;
  line-height: 1.4;
  padding-right: 8px;
  flex: 1;
`;

export const Timestamp = styled.span`
  font-size: 13px;
  color: #8a94a6;
  font-weight: 500;
  display: flex;
  align-items: center;
  white-space: nowrap;
  flex-shrink: 0;

  svg {
    margin-right: 5px;
    flex-shrink: 0;
  }
`;

export const Content = styled.div<{ truncate: boolean }>`
  font-size: 15px;
  line-height: 1.6;
  color: #4e5468;
  overflow: hidden;
  font-weight: 400;
  margin-top: 2px;

  ${props => props.truncate && `
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
  `}

  a {
    color: #6d62c9;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }

  strong, b {
    font-weight: 600;
    color: #333344;
  }

  p {
    margin: 0 0 10px 0;

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

export const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  min-width: 0;
  overflow: hidden;
  flex: 1;
`;

export const ExpandButton = styled.button`
  background: none;
  border: none;
  font-size: 14px;
  color: #6d62c9;
  cursor: pointer;
  padding: 8px 0;
  font-weight: 500;
  text-align: left;
  margin-top: 8px;
  display: flex;
  align-items: center;

  &:hover {
    color: #5246b8;
  }

  svg {
    margin-left: 4px;
    transition: transform 0.2s ease;
    flex-shrink: 0;
  }
`;

export const ActionFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #eef0f5;
`;

export const ActionButton = styled.button`
  background: none;
  border: none;
  font-size: 13px;
  color: #8a94a6;
  cursor: pointer;
  padding: 6px 12px;
  font-weight: 500;
  border-radius: 8px;
  display: flex;
  align-items: center;
  margin-left: 10px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f5f7fb;
    color: #666CFF;
  }

  svg {
    margin-right: 6px;
    flex-shrink: 0;
  }
`;
