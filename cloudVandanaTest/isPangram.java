import java.util.HashSet;

public class isPangram {
    public static void main(String[] args) {
        System.out.println(isPangram("The quick brown fox jumps over the lazy dog"));
    }

    public static boolean isPangram(String input) {
        HashSet<Character> alphabetSet = new HashSet<>();

        for (char c : input.toCharArray()) {
            if (Character.isLetter(c)) {
                alphabetSet.add(Character.toLowerCase(c));
            }
        }

        return alphabetSet.size() == 26;
    }
}