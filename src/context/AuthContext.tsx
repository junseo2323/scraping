//Auth 전달을 위한 Auth context 파일
'use client';

type Props = {
  children: React.ReactNode;
};

export default function AuthContext({ children }: Props) {
  return <div>{children}</div>;
}
