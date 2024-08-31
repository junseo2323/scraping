import Inputbox from '@/components/Inputbox'
import Logo from '@/components/Logo'
import Button from '@/components/Button'

export default function Register() {
    return (
        <div>
            <Logo />

            <div className='m-20 '>
                <p className=' text-4xl font-black text-center mb-10'>회원가입</p>
                <Inputbox type="email" label='이메일'/>
                <Inputbox type="password" label='비밀번호'/>
                <Inputbox type="password" label='비밀번호 재입력'/>
                <Inputbox type="text" label='별명'/>
                <Inputbox type="text" label='한단어 소개'/>
                <p>한단어로 자신을 소개해보세요!</p>

                <div className='mt-24 grid grid-cols-1 place-items-end'>
                    <Button text='가입하기'/>
                </div>
            </div>
        </div>
    )
}
