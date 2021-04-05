import React from 'react';
import { getLocale, setLocale } from 'umi';
import { Button, DatePicker } from 'antd';
import { useMount } from 'ahooks';
import { SearchOutlined } from '@ant-design/icons';

export default function Exception404() {
  useMount(() => {
    console.log('abc');
  });
  const handleClickButton = () => {
    const locale = getLocale();
    setLocale(locale === 'zh-CN' ? 'en-US' : 'zh-CN');
  };
  return (
    <div>
      <div>404</div>
      <Button
        type="primary"
        icon={<SearchOutlined />}
        onClick={handleClickButton}
      >
        Search
      </Button>
      <DatePicker />
    </div>
  );
}
