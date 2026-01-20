import {
    Container,
    Card,
    CardContent,
    Typography,
    Box,
    Button,
    Divider,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    TextField,
    InputAdornment,
} from '@mui/material';
import { Login as LoginIcon } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { authClienteInitialState, type AuthClienteType } from '../../../types/authType';
import { zodResolver } from '@hookform/resolvers/zod';
import { authClienteSchema } from '../../../zod/auth.schema';
import { errorToast, successToast } from '../../../utils/toast';
import { useGoTo } from '../../../hooks/useGoTo';
import { useAuthStore } from '../../../store/useAuthStore';
import FormEstructure from '../../../components/utils/FormEstructure';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import CallToActionOutlinedIcon from '@mui/icons-material/CallToActionOutlined';

const LoginClientes = () => {
    const loginCliente = useAuthStore(state => state.loginCliente);
    const goTo = useGoTo();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        watch,
        setValue,
    } = useForm<AuthClienteType>({
        resolver: zodResolver(authClienteSchema),
        mode: 'onSubmit',
        defaultValues: { ...authClienteInitialState, placa: 'M' },
    });

    const userType = watch('userType');
    const placaValue = watch('placa');

    useEffect(() => {
        if (typeof placaValue !== 'string') return;
        if (!placaValue.startsWith('M')) {
            const withoutMs = placaValue.replace(/^M+/, '');
            setValue('placa', 'M' + withoutMs, { shouldValidate: true, shouldDirty: true });
        }
    }, [placaValue, setValue]);

    const handleLogin = async (data: AuthClienteType) => {
        try {
            await loginCliente(data);
            const user = useAuthStore.getState().user;
            successToast('Auth Succes: Hello ' + user?.primerNombre);
            reset();
            goTo('/admin');
        } catch (err: any) {
            errorToast(err.message);
        }
    };

    return (
        <Container maxWidth="xs" sx={{ mt: 2, mb: 2, display: 'flex', justifyContent: 'center' }}>

            <FormEstructure sx={{ padding: 0, margin: 0, border: "none", boxShadow: "none" }} pGrid={1} handleSubmit={handleSubmit(handleLogin)}>
                <Card elevation={3} sx={{ borderRadius: 2 }}>
                    <CardContent sx={{ p: 4 }}>
                        <Box sx={{ textAlign: 'center', mb: 3 }}>
                            <LoginIcon sx={{ fontSize: 48, color: 'primary.main' }} />
                            <Typography variant="h5" fontWeight={700} mt={1} mb={2}>
                                Login Clientes
                            </Typography>
                        </Box>

                        <FormControl component="fieldset" sx={{ mb: 2 }}>
                            <RadioGroup
                                row
                                value={userType}
                                onChange={e => setValue('userType', e.target.value as any)}
                            >
                                <FormControlLabel value="USUARIO REGULAR" control={<Radio />} label="Usuario regular" />
                                <FormControlLabel value="EMPRESA" control={<Radio />} label="Empresa" />
                            </RadioGroup>
                        </FormControl>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label={userType === 'EMPRESA' ? 'NIT' : 'DPI'}
                            {...register('identifier')}
                            error={!!errors.identifier}
                            helperText={errors?.identifier?.message}
                            disabled={!userType}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <BadgeOutlinedIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Placa de la moto"
                            {...register('placa')}
                            error={!!errors.placa}
                            helperText={errors?.placa?.message}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CallToActionOutlinedIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Box>
                            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                ¿Eres parte de MotoServicioVM?{' '}
                                <Button variant="text" onClick={() => goTo('/public/auth/login')}>
                                    Inicia Sesion aquí
                                </Button>
                            </Typography>
                        </Box>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={isSubmitting}
                        >
                            Ingresar
                        </Button>
                    <Divider sx={{ my: 3 }} />
                    </CardContent>   
                </Card>
            </FormEstructure>
        </Container>
    );
};

export default LoginClientes;
