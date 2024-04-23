import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, View, Platform } from 'react-native';
import { TextInput, Button, Card, Title } from 'react-native-paper';
import { getAuth, updateProfile, updateEmail, updatePassword } from 'firebase/auth';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import LogoComponent from '../components/LogoComponent';
import CustomTheme from '../../theme'; // Correctly import your custom theme

const ProfileScreen = ({ navigation }) => {
    const auth = getAuth();
    const db = getDatabase();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = auth.currentUser;
        const userRef = ref(db, `judges/${user.uid}`);
        onValue(userRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setFirstName(data.firstName);
                setLastName(data.lastName);
                setEmail(user.email);
            }
            setLoading(false);
        });

        return () => {
            // Cleanup listener
        };
    }, [auth, db]);

    const handleUpdate = async () => {
        if (!firstName || !lastName || !email) {
            alert("Please fill in all fields");
            return;
        }

        try {
            const user = auth.currentUser;
            await updateProfile(user, {
                displayName: `${firstName} ${lastName}`
            });
            if (user.email !== email) {
                await updateEmail(user, email);
            }
            if (password) {
                await updatePassword(user, password);
            }

            await set(ref(db, `judges/${user.uid}`), {
                firstName,
                lastName,
                email
            });

            alert("Profile updated successfully!");
        } catch (error) {
            alert(`Failed to update profile: ${error.message}`);
        }
    };

    if (loading) {
        return <View style={styles.container}><Title>Loading...</Title></View>;
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <LogoComponent />
                <Card style={styles.card}>
                    <Card.Title title="Edit Profile" />
                    <Card.Content>
                        <TextInput
                            mode="outlined"
                            label="First Name"
                            value={firstName}
                            onChangeText={setFirstName}
                            style={styles.input}
                        />
                        <TextInput
                            mode="outlined"
                            label="Last Name"
                            value={lastName}
                            onChangeText={setLastName}
                            style={styles.input}
                        />
                        <TextInput
                            mode="outlined"
                            label="Email"
                            value={email}
                            onChangeText={setEmail}
                            style={styles.input}
                        />
                        <TextInput
                            mode="outlined"
                            label="Password (leave blank to keep current)"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                            style={styles.input}
                        />
                        <Button 
                            mode="contained"
                            onPress={handleUpdate}
                            style={styles.button}
                        >
                            Save Changes
                        </Button>
                    </Card.Content>
                </Card>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: CustomTheme.colors.background, // Use your custom theme colors
    },
    scrollView: {
        flexGrow: 1,
        justifyContent: 'center'
    },
    card: {
        padding: 20,
        marginVertical: 20
    },
    input: {
        marginBottom: 10,
        // Apply your custom theme styles to your input here
        // For example:
        backgroundColor: CustomTheme.colors.surface,
        borderColor: CustomTheme.colors.outline,
        borderRadius: CustomTheme.roundness,
    },
    button: {
        marginTop: 20,
        backgroundColor: CustomTheme.colors.primary, // Apply the primary color from your theme
    }
});

export default ProfileScreen;