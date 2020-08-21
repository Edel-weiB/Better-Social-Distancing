package com.example.cotrace.ui.scan;

import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModel;
import androidx.lifecycle.ViewModelProviders;

import android.content.Intent;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import com.example.cotrace.QRreader;
import com.example.cotrace.R;
import com.example.cotrace.ui.settings.SettingsViewModel;

public class ScanFragment extends Fragment {

    private ScanViewModel scanViewModel;


    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        scanViewModel =
                ViewModelProviders.of(this).get(ScanViewModel.class);
        View root = inflater.inflate(R.layout.fragment_scan, container, false);
//        final ImageView blackBoxView = root.findViewById(R.id.black_box);

        Button qr_button = root.findViewById(R.id.qr_button);
        qr_button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(new Intent(getContext(), QRreader.class));
            }
        });


        return root;
    }

}