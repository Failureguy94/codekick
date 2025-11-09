import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, Shield, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const countryCodes = [
  { code: '+1', country: 'US/Canada' },
  { code: '+91', country: 'India' },
  { code: '+44', country: 'UK' },
  { code: '+61', country: 'Australia' },
  { code: '+81', country: 'Japan' },
  { code: '+86', country: 'China' },
  { code: '+33', country: 'France' },
  { code: '+49', country: 'Germany' },
];

export default function VerifyPhone() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [countryCode, setCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    // Check if phone is already verified
    const checkPhoneVerification = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('phone_verified')
        .eq('id', user.id)
        .single();

      if (data?.phone_verified) {
        navigate('/profile');
      }
    };

    checkPhoneVerification();
  }, [user, navigate]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        title: 'Invalid phone number',
        description: 'Please enter a valid phone number',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: { phoneNumber, countryCode },
      });

      if (error) throw error;

      toast({
        title: 'OTP Sent',
        description: 'Verification code sent to your phone',
      });

      setStep('otp');
      setResendTimer(60);
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to send OTP. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast({
        title: 'Invalid OTP',
        description: 'Please enter the complete 6-digit code',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const fullPhoneNumber = `${countryCode}${phoneNumber}`;
      const { data, error } = await supabase.functions.invoke('verify-otp', {
        body: { phoneNumber: fullPhoneNumber, otpCode: otp },
      });

      if (error) throw error;

      toast({
        title: 'Success!',
        description: 'Phone number verified successfully',
      });

      navigate('/profile');
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      toast({
        title: 'Verification Failed',
        description: error.message || 'Invalid OTP. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-card border border-border rounded-2xl shadow-2xl p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              {step === 'phone' ? (
                <Phone className="w-8 h-8 text-primary" />
              ) : (
                <Shield className="w-8 h-8 text-primary" />
              )}
            </div>
            <h1 className="text-3xl font-bold text-center mb-2">
              {step === 'phone' ? 'Verify Your Phone' : 'Enter Verification Code'}
            </h1>
            <p className="text-muted-foreground text-center text-sm">
              {step === 'phone'
                ? 'We need to verify your phone number for security'
                : `Enter the 6-digit code sent to ${countryCode} ${phoneNumber}`}
            </p>
          </div>

          {step === 'phone' ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="countryCode">Country Code</Label>
                <Select value={countryCode} onValueChange={setCountryCode}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {countryCodes.map((item) => (
                      <SelectItem key={item.code} value={item.code}>
                        {item.code} ({item.country})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="1234567890"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  maxLength={15}
                />
              </div>

              <Button
                onClick={handleSendOTP}
                disabled={loading || !phoneNumber}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send OTP
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-center block">
                  Verification Code
                </Label>
                <div className="flex justify-center">
                  <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              <Button
                onClick={handleVerifyOTP}
                disabled={loading || otp.length !== 6}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify OTP
                    <Shield className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              <div className="text-center space-y-2">
                <Button
                  variant="ghost"
                  onClick={handleSendOTP}
                  disabled={loading || resendTimer > 0}
                  className="text-sm"
                >
                  {resendTimer > 0
                    ? `Resend OTP in ${resendTimer}s`
                    : 'Resend OTP'}
                </Button>
                <Button
                  variant="link"
                  onClick={() => {
                    setStep('phone');
                    setOtp('');
                  }}
                  className="text-sm"
                >
                  Change phone number
                </Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
