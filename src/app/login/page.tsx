import Inputbox from '@/components/Inputbox'
import Logo from '@/components/Logo'
import Button from '@/components/Button'

export default function Login() {
    return (
        <div>
            <Logo />

            <div className='m-20 '>
                <p className=' text-4xl font-black text-center mb-10'>로그인</p>
                <Inputbox type="email" label='이메일'/>
                <Inputbox type="password" label='비밀번호'/>
            
                <div className='mt-24 grid grid-cols-1 place-items-end'>
                    <Button text='로그인'/>
                </div>
            </div>
        </div>
    )
}
