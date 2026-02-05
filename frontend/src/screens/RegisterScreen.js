import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';

const RegisterScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const { register } = useContext(AuthContext);

    const handleRegister = async () => {
        if (!username || !password) {
            Alert.alert('แจ้งเตือน', 'กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }
        try {
            await register(username, password, role);
        } catch (error) {
            Alert.alert('สมัครสมาชิกไม่สำเร็จ', error.response?.data?.message || 'เกิดข้อผิดพลาดบางอย่าง');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>📝 สมัครสมาชิก</Text>

                <TextInput
                    style={styles.input}
                    placeholder="ชื่อผู้ใช้"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="รหัสผ่าน"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <View style={styles.roleContainer}>
                    <Text style={styles.roleLabel}>สถานะ:</Text>
                    <View style={styles.roleButtons}>
                        <TouchableOpacity
                            style={[styles.roleBtn, role === 'user' && styles.roleBtnActive]}
                            onPress={() => setRole('user')}
                        >
                            <Text style={[styles.roleBtnText, role === 'user' && styles.roleBtnTextActive]}>สมาชิกทั่วไป</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.roleBtn, role === 'admin' && styles.roleBtnActive]}
                            onPress={() => setRole('admin')}
                        >
                            <Text style={[styles.roleBtnText, role === 'admin' && styles.roleBtnTextActive]}>ผู้ดูแล</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                    <Text style={styles.registerButtonText}>ยืนยันการสมัคร</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.loginLink}>มีบัญชีแล้ว? เข้าสู่ระบบ</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', backgroundColor: '#f8f9fa', padding: 20 },
    card: { backgroundColor: '#ffffff', padding: 30, borderRadius: 15, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 5 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#2c3e50', textAlign: 'center', marginBottom: 25 },

    input: { backgroundColor: '#f0f2f5', borderRadius: 8, padding: 15, marginBottom: 15, fontSize: 16, color: '#2c3e50' },

    roleContainer: { marginBottom: 20 },
    roleLabel: { fontSize: 14, color: '#7f8c8d', marginBottom: 10 },
    roleButtons: { flexDirection: 'row', backgroundColor: '#f0f2f5', borderRadius: 8, padding: 4 },
    roleBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 6 },
    roleBtnActive: { backgroundColor: '#ffffff', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 2, elevation: 1 },
    roleBtnText: { color: '#7f8c8d', fontWeight: '500' },
    roleBtnTextActive: { color: '#2c3e50', fontWeight: 'bold' },

    registerButton: { backgroundColor: '#2ecc71', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
    registerButtonText: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },

    loginLink: { color: '#7f8c8d', textAlign: 'center', marginTop: 20 }
});

export default RegisterScreen;
